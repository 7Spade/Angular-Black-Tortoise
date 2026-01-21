# Domain Patterns Implementation Guide

This document describes the DDD patterns implemented in the domain layer.

## Overview

The domain layer now includes complete DDD tactical patterns:

1. **Aggregate Factories** - Enforce invariants at creation
2. **Domain Events** - Immutable records of state changes
3. **Behavior Methods** - State transitions with domain logic
4. **Specifications** - Reusable business rules
5. **Domain Errors** - Typed error hierarchy
6. **Domain Services** - Cross-aggregate business logic

## Architecture

```
domain/
├── shared/
│   ├── events/
│   │   ├── domain-event.interface.ts     # Base event interface
│   │   └── aggregate-root.interface.ts   # Event collection support
│   ├── errors/
│   │   ├── domain.error.ts               # Base domain error
│   │   ├── invariant-violation.error.ts  # Invariant failures
│   │   ├── illegal-state-transition.error.ts
│   │   ├── quota-exceeded.error.ts
│   │   └── authorization.error.ts
│   └── specifications/
│       └── specification.interface.ts     # Specification pattern
├── workspace/
│   ├── aggregates/
│   │   └── workspace.aggregate.ts        # Aggregate with behaviors
│   ├── factories/
│   │   └── workspace-aggregate.factory.ts # Factory with invariants
│   ├── events/
│   │   ├── workspace-created.event.ts
│   │   ├── workspace-archived.event.ts
│   │   ├── workspace-activated.event.ts
│   │   ├── workspace-deleted.event.ts
│   │   ├── module-added-to-workspace.event.ts
│   │   └── module-removed-from-workspace.event.ts
│   ├── specifications/
│   │   ├── can-add-module.specification.ts
│   │   └── workspace-is-active.specification.ts
│   └── services/
│       └── workspace-operation-policy.service.ts
└── membership/
    ├── entities/
    │   └── organization-membership.entity.ts # Aggregate with behaviors
    ├── factories/
    │   └── organization-membership.factory.ts
    ├── events/
    │   ├── membership-created.event.ts
    │   ├── membership-activated.event.ts
    │   ├── membership-suspended.event.ts
    │   └── membership-role-changed.event.ts
    └── specifications/
        ├── membership-is-active.specification.ts
        └── membership-has-admin-privileges.specification.ts
```

## 1. Aggregate Factories

Factories enforce invariants and emit creation events.

### Creating New Aggregates

```typescript
// Use factory to create with invariants enforced
const workspace = WorkspaceAggregateFactory.createNew({
  owner: WorkspaceOwner.create({ id: userId, type: 'user' }),
  quota: WorkspaceQuota.unlimited(),
});

// Events are automatically collected
const events = workspace.getDomainEvents();
// [WorkspaceCreatedEvent { aggregateId: '...', ownerId: '...', ... }]
```

### Reconstituting from Persistence

```typescript
// Reconstitute without emitting events
const workspace = WorkspaceAggregateFactory.reconstitute({
  id: workspaceId,
  owner: owner,
  lifecycle: WorkspaceLifecycle.Active,
  quota: quota,
  moduleIds: moduleIds,
});

// No events are emitted for reconstitution
workspace.getDomainEvents(); // []
```

### Invariant Enforcement

```typescript
// Factory enforces invariants
const workspace = WorkspaceAggregateFactory.createNew({
  owner: null, // ❌ Throws InvariantViolationError
});

const workspace = WorkspaceAggregateFactory.createNew({
  owner: owner,
  quota: WorkspaceQuota.create({ maxProjects: 1 }),
  moduleIds: [module1, module2], // ❌ Throws InvariantViolationError (exceeds quota)
});
```

## 2. Domain Events

Immutable records of facts that happened in the domain.

### Event Structure

```typescript
interface DomainEvent {
  readonly eventId: string;      // Unique event ID
  readonly occurredAt: Date;     // When it happened
  readonly eventType: string;    // Event type name
  readonly aggregateId: string;  // Which aggregate
}
```

### Creating Events

Events extend `BaseDomainEvent`:

```typescript
export class WorkspaceCreatedEvent extends BaseDomainEvent {
  readonly eventType = 'WorkspaceCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly ownerId: string,
    public readonly ownerType: 'user' | 'organization'
  ) {
    super(); // Sets eventId and occurredAt
  }
}
```

### Event Collection

Aggregates collect events during their lifecycle:

```typescript
class WorkspaceAggregate extends AggregateRoot {
  archive(): void {
    this.lifecycle = WorkspaceLifecycle.Archived;
    this.addDomainEvent(new WorkspaceArchivedEvent(this.id.getValue()));
  }
}

// Usage in use case
const workspace = await loadWorkspace();
workspace.archive();

const events = workspace.getDomainEvents();
// [WorkspaceArchivedEvent { ... }]

// Publish events
eventPublisher.publishAll(events);

// Clear after publishing
workspace.clearDomainEvents();
```

## 3. Behavior Methods

Aggregates expose behavior methods that enforce transitions and emit events.

### State Transitions

```typescript
class WorkspaceAggregate extends AggregateRoot {
  activate(): void {
    // Enforce business rule
    if (this.lifecycle === WorkspaceLifecycle.Deleted) {
      throw new IllegalStateTransitionError(
        WorkspaceLifecycle.Deleted,
        'activate'
      );
    }

    // Idempotent check
    if (this.lifecycle === WorkspaceLifecycle.Active) {
      return; // Already active
    }

    // State change
    this.lifecycle = WorkspaceLifecycle.Active;

    // Emit event
    this.addDomainEvent(new WorkspaceActivatedEvent(this.id.getValue()));
  }
}
```

### Quota Enforcement

```typescript
class WorkspaceAggregate extends AggregateRoot {
  addModule(moduleId: ModuleId): void {
    // Business rule: check quota
    if (!this.quota.canAddProjects(this.moduleIds.length, 1)) {
      throw new QuotaExceededError(
        'projects',
        this.quota.getMaxProjects(),
        this.moduleIds.length + 1
      );
    }

    // State change
    this.moduleIds.push(moduleId);

    // Emit event
    this.addDomainEvent(
      new ModuleAddedToWorkspaceEvent(this.id.getValue(), moduleId.getValue())
    );
  }
}
```

## 4. Specifications

Reusable business rules that can be composed.

### Basic Specification

```typescript
export class WorkspaceIsActiveSpecification extends BaseSpecification<WorkspaceAggregate> {
  isSatisfiedBy(workspace: WorkspaceAggregate): boolean {
    return workspace.isActive();
  }

  getReasonIfNotSatisfied(workspace: WorkspaceAggregate): string | null {
    if (this.isSatisfiedBy(workspace)) {
      return null;
    }
    return `Workspace is not active (current state: ${workspace.getLifecycle()})`;
  }
}
```

### Composing Specifications

```typescript
// Combine with AND
const activeAndCanAddModules = 
  new WorkspaceIsActiveSpecification()
    .and(new CanAddModuleSpecification());

if (activeAndCanAddModules.isSatisfiedBy(workspace)) {
  workspace.addModule(moduleId);
} else {
  const reason = activeAndCanAddModules.getReasonIfNotSatisfied(workspace);
  throw new Error(reason);
}

// Combine with OR
const canEditSpec = isOwnerSpec.or(isAdminSpec);

// Negate
const isNotDeletedSpec = new WorkspaceIsDeletedSpecification().not();
```

## 5. Domain Errors

Typed error hierarchy for different failure scenarios.

### Error Types

```typescript
// Base domain error
throw new DomainError('Generic domain failure');

// Invariant violation (creation, factory)
throw new InvariantViolationError('Workspace must have an owner');

// Illegal state transition
throw new IllegalStateTransitionError(
  WorkspaceLifecycle.Deleted,
  'activate'
);

// Quota exceeded
throw new QuotaExceededError(
  'projects',
  maxProjects,
  attemptedCount
);

// Authorization failure
throw new AuthorizationError('Cannot change role of organization owner');
```

### Error Handling in Application Layer

```typescript
@Injectable()
export class ArchiveWorkspaceUseCase {
  async execute(request: ArchiveWorkspaceRequest): Promise<Response> {
    try {
      const workspace = await this.loadWorkspace(request.workspaceId);
      workspace.archive(); // May throw IllegalStateTransitionError
      await this.save(workspace);
      return { success: true };
    } catch (error) {
      if (error instanceof IllegalStateTransitionError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
```

## 6. Domain Services

Cross-aggregate or complex business logic.

### Policy Service

```typescript
export class WorkspaceOperationPolicy {
  static canAddModules(workspace: WorkspaceAggregate): boolean {
    const spec = new WorkspaceIsActiveSpecification()
      .and(new CanAddModuleSpecification());
    return spec.isSatisfiedBy(workspace);
  }

  static enforceCanAddModules(workspace: WorkspaceAggregate): void {
    if (!this.canAddModules(workspace)) {
      throw new AuthorizationError('Cannot add modules to workspace');
    }
  }
}

// Usage
WorkspaceOperationPolicy.enforceCanAddModules(workspace);
workspace.addModule(moduleId);
```

## Application Layer Integration

### Use Case Pattern

```typescript
@Injectable()
export class CreateWorkspaceUseCase {
  async execute(request: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> {
    // 1. Create value objects
    const owner = WorkspaceOwner.create({ id: userId, type: 'user' });

    // 2. Use factory (enforces invariants)
    const workspace = WorkspaceAggregateFactory.createNew({ owner });

    // 3. Collect events
    const events = workspace.getDomainEvents();

    // 4. Persist
    await this.repository.save(workspace.toEntity());

    // 5. Clear events
    workspace.clearDomainEvents();

    // 6. Return events for publishing
    return { workspaceId: workspace.getId().getValue(), events };
  }
}
```

### Facade Pattern

```typescript
@Injectable()
export class WorkspaceFacade {
  async createWorkspace(ownerId: string, ownerType: 'user' | 'organization'): Promise<string> {
    // Execute use case
    const result = await this.createWorkspaceUseCase.execute({ ownerId, ownerType });

    // Publish events
    this.eventPublisher.publishAll(result.events);

    // Update store
    this.workspaceStore.setActiveOwner(ownerType, ownerId);

    return result.workspaceId;
  }
}
```

## Best Practices

### 1. Always Use Factories

```typescript
// ✅ Good - use factory
const workspace = WorkspaceAggregateFactory.createNew({ owner });

// ❌ Bad - direct construction bypasses invariants
const workspace = WorkspaceAggregate.create({ id, owner, ... });
```

### 2. Collect and Publish Events

```typescript
// ✅ Good - collect, persist, then publish
const events = aggregate.getDomainEvents();
await repository.save(aggregate.toEntity());
aggregate.clearDomainEvents();
eventPublisher.publishAll(events);

// ❌ Bad - publish before persistence
eventPublisher.publishAll(aggregate.getDomainEvents());
await repository.save(aggregate.toEntity()); // May fail!
```

### 3. Use Specifications for Complex Rules

```typescript
// ✅ Good - reusable specification
const canEditSpec = new WorkspaceIsActiveSpecification()
  .and(new UserIsOwnerSpecification(userId));
if (!canEditSpec.isSatisfiedBy(workspace)) {
  throw new AuthorizationError(canEditSpec.getReasonIfNotSatisfied(workspace));
}

// ❌ Bad - inline checks scattered everywhere
if (workspace.getLifecycle() !== WorkspaceLifecycle.Active) { ... }
if (workspace.getOwner().getUserId()?.equals(userId)) { ... }
```

### 4. Behavior Methods Are Idempotent

```typescript
// ✅ Good - idempotent
activate(): void {
  if (this.lifecycle === WorkspaceLifecycle.Active) {
    return; // Already active, no event
  }
  this.lifecycle = WorkspaceLifecycle.Active;
  this.addDomainEvent(new WorkspaceActivatedEvent(...));
}

// Multiple calls are safe
workspace.activate();
workspace.activate(); // No duplicate event
```

### 5. Domain Errors Are Specific

```typescript
// ✅ Good - specific error type
throw new QuotaExceededError('projects', maxProjects, attempted);

// ❌ Bad - generic error
throw new Error('Quota exceeded');
```

## Compliance Checklist

- [x] Aggregate factories enforce invariants
- [x] Factories emit creation events for new aggregates
- [x] Factories do NOT emit events when reconstituting
- [x] All aggregates extend AggregateRoot
- [x] Behavior methods emit immutable domain events
- [x] Events are collected via getDomainEvents()
- [x] Events are cleared via clearDomainEvents()
- [x] Specifications are reusable and composable
- [x] Domain services use specifications
- [x] Domain errors are typed and specific
- [x] No Observable/RxJS in domain layer
- [x] No Firebase types in domain layer
- [x] Application layer uses Promise only
- [x] Use cases collect and return events
- [x] Facades publish events after persistence

## Testing Examples

### Testing Aggregates

```typescript
describe('WorkspaceAggregate', () => {
  it('should emit WorkspaceCreatedEvent on creation', () => {
    const workspace = WorkspaceAggregateFactory.createNew({ owner });
    const events = workspace.getDomainEvents();
    
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(WorkspaceCreatedEvent);
  });

  it('should throw IllegalStateTransitionError when activating deleted workspace', () => {
    const workspace = createDeletedWorkspace();
    
    expect(() => workspace.activate()).toThrow(IllegalStateTransitionError);
  });

  it('should be idempotent when archiving twice', () => {
    const workspace = createActiveWorkspace();
    
    workspace.archive();
    const firstEvents = [...workspace.getDomainEvents()];
    workspace.clearDomainEvents();
    
    workspace.archive();
    const secondEvents = workspace.getDomainEvents();
    
    expect(firstEvents).toHaveLength(1);
    expect(secondEvents).toHaveLength(0); // Idempotent
  });
});
```

### Testing Specifications

```typescript
describe('CanAddModuleSpecification', () => {
  it('should be satisfied when under quota', () => {
    const workspace = createWorkspaceWithQuota(maxProjects: 5, current: 3);
    const spec = new CanAddModuleSpecification();
    
    expect(spec.isSatisfiedBy(workspace)).toBe(true);
    expect(spec.getReasonIfNotSatisfied(workspace)).toBeNull();
  });

  it('should not be satisfied when at quota', () => {
    const workspace = createWorkspaceWithQuota(maxProjects: 5, current: 5);
    const spec = new CanAddModuleSpecification();
    
    expect(spec.isSatisfiedBy(workspace)).toBe(false);
    expect(spec.getReasonIfNotSatisfied(workspace)).toContain('quota limit');
  });
});
```

## Summary

All domain patterns are now implemented following DDD tactical patterns:

- ✅ Factories enforce invariants
- ✅ Events track all state changes
- ✅ Behaviors encapsulate business logic
- ✅ Specifications enable reusable rules
- ✅ Domain errors provide clear failure semantics
- ✅ Services coordinate complex operations
- ✅ No framework dependencies in domain
- ✅ Application layer orchestrates and publishes events
