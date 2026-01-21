import { WorkspaceAggregate } from '../aggregates/workspace.aggregate';
import { WorkspaceId } from '../value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import { WorkspaceQuota } from '../value-objects/workspace-quota.value-object';
import { WorkspaceLifecycle } from '../enums/workspace-lifecycle.enum';
import { InvariantViolationError } from '@domain/shared/errors';
import type { ModuleId } from '@domain/modules/value-objects/module-id.value-object';

/**
 * Factory for creating WorkspaceAggregate instances with proper invariant enforcement.
 * 
 * DDD Compliance:
 * - Factories enforce aggregate invariants at creation
 * - Factories encapsulate complex creation logic
 * - Factories ensure aggregates are always in valid state
 * - Factories belong to the domain layer
 */
export class WorkspaceAggregateFactory {
  /**
   * Create a new workspace aggregate with default quota.
   * Enforces invariants and emits domain event.
   */
  static createNew(props: {
    owner: WorkspaceOwner;
    quota?: WorkspaceQuota;
    moduleIds?: ReadonlyArray<ModuleId>;
  }): WorkspaceAggregate {
    // Enforce invariant: owner must be valid
    if (!props.owner) {
      throw new InvariantViolationError('Workspace must have an owner');
    }

    // Generate new ID
    const id = WorkspaceId.generate();

    // Use provided quota or create default unlimited quota
    const quota = props.quota ?? WorkspaceQuota.unlimited();

    // Enforce invariant: initial module count must not exceed quota
    const moduleIds = props.moduleIds ?? [];
    if (!quota.canAddProjects(0, moduleIds.length)) {
      throw new InvariantViolationError(
        `Cannot create workspace with ${moduleIds.length} modules, quota limit is ${quota.getMaxProjects()}`
      );
    }

    // Create aggregate with initial state and mark as new (to emit event)
    return WorkspaceAggregate.create({
      id,
      owner: props.owner,
      lifecycle: WorkspaceLifecycle.Active,
      quota,
      moduleIds,
      isNew: true, // This triggers WorkspaceCreatedEvent
    });
  }

  /**
   * Reconstitute a workspace aggregate from persistence.
   * Used when loading from repository.
   * Does NOT emit creation event.
   */
  static reconstitute(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    lifecycle: WorkspaceLifecycle;
    quota: WorkspaceQuota;
    moduleIds: ReadonlyArray<ModuleId>;
  }): WorkspaceAggregate {
    // Enforce invariants even when reconstituting
    if (!props.id) {
      throw new InvariantViolationError('Workspace must have an ID');
    }
    if (!props.owner) {
      throw new InvariantViolationError('Workspace must have an owner');
    }
    if (!props.quota) {
      throw new InvariantViolationError('Workspace must have a quota');
    }

    return WorkspaceAggregate.create({
      id: props.id,
      owner: props.owner,
      lifecycle: props.lifecycle,
      quota: props.quota,
      moduleIds: props.moduleIds ?? [],
      isNew: false, // No event for reconstitution
    });
  }
}
