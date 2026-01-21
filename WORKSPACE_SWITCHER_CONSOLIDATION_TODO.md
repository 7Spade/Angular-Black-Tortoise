# Workspace/Identity Switcher Signal Consolidation - TODO Skeleton

## Analysis Summary

**Status**: ⚠️ **STOPPED - Conflicts Detected**

### Conflicting Implementations Found

#### 1. Duplicate Active Owner/Workspace Signals

**IdentityStore** (`src/app/application/stores/identity.store.ts`):
- Signal: `activeWorkspaceOwner: { ownerId: string; ownerType: WorkspaceOwnerType } | null`
- Setter: `selectWorkspaceOwner(ownerType, ownerId)`
- Behavior: Emits `WorkspaceOwnerSelectedEvent` via `AppEventBus`

**WorkspaceStore** (`src/app/application/stores/workspace.store.ts`):
- Signal: `activeOwner: WorkspaceOwnerSelection | null`
- Setter: `setActiveOwner(ownerType, ownerId)`
- Behavior: Listens to `AppEventBus.onWorkspaceOwnerSelected()` via `connectOwnerSelection()`

**Issue**: Two stores maintain similar state for the same concern (active workspace owner). This violates Single Source of Truth principle.

#### 2. Event Bus Pattern

**Current Implementation** (`src/app/application/event-bus/app-event-bus.service.ts`):
- Uses RxJS `Subject` and `Observable` (not signals-only)
- Singleton service (`providedIn: 'root'`)
- Single global event bus for all events

**Requirement Conflict**: Requirements specify:
- "workspace-scoped Event Bus created by Workspace Runtime and passed into Module (not singleton)"
- "Use signals-only, zone-less"

Current implementation is RxJS-based singleton, not workspace-scoped and not signals-only.

### Required Consolidation Steps

#### Phase 1: Resolve Active Owner State Duplication

**Option A: Single Owner Store (Recommended)**
```typescript
// Keep workspace owner state in ONE store only
// Recommendation: Keep in WorkspaceStore as it's the primary consumer
// Remove: IdentityStore.activeWorkspaceOwner
// Keep: WorkspaceStore.activeOwner
```

**Option B: Separate Concerns Completely**
```typescript
// IdentityStore: Only manages identity entities (users, orgs, bots)
// WorkspaceStore: Only manages workspace entities and active selection
// Selection logic: Move to dedicated SelectionStore or context
```

**TODO**:
- [ ] Decide on Option A or B
- [ ] Remove duplicate `activeWorkspaceOwner` signal from one store
- [ ] Update all references to use single source
- [ ] Update event emission to use single store method

#### Phase 2: Create Workspace-Scoped Event Bus

**Requirements**:
- Not singleton
- Signals-only (no RxJS Observable)
- Created by Workspace Runtime
- Passed into modules via constructor or input
- Scoped to workspace instance

**TODO**:
- [ ] Create `WorkspaceEventBus` class (non-injectable, plain TypeScript class)
```typescript
// Pseudo-code structure
export class WorkspaceEventBus {
  private readonly events = signal<WorkspaceEvent[]>([]);
  
  publish(event: WorkspaceEvent): void {
    this.events.update(events => [...events, event]);
  }
  
  subscribe<T extends WorkspaceEvent>(
    eventType: string,
    handler: (event: T) => void
  ): () => void {
    // Return unsubscribe function
  }
}
```

- [ ] Create `WorkspaceRuntime` service or class
```typescript
// Manages workspace lifecycle and event bus instance
export class WorkspaceRuntime {
  readonly eventBus: WorkspaceEventBus;
  readonly workspaceId: string;
  
  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
    this.eventBus = new WorkspaceEventBus();
  }
}
```

- [ ] Update module initialization to receive event bus
```typescript
// Example module structure
export class OverviewModule {
  constructor(eventBus: WorkspaceEventBus) {
    // Subscribe to events
    eventBus.subscribe('some-event', this.handleEvent.bind(this));
  }
}
```

#### Phase 3: Migrate Event Definitions

**Current Events** (from `app-event-bus.service.ts`):
- `WorkspaceOwnerSelectedEvent`

**TODO**:
- [ ] Define workspace-scoped event types
- [ ] Create event interfaces for:
  - Overview module events
  - Documents module events
  - Tasks module events
  - Daily module events
  - QualityControl module events
  - Acceptance module events
  - Issues module events
  - Members module events
  - Permissions module events
  - Audit module events
  - Settings module events
- [ ] Decide: Keep global AppEventBus for app-level events? Or consolidate all?

#### Phase 4: Create Presentation Module Structure

**Modules to Implement** (from requirements):
1. OverviewModule
2. DocumentsModule
3. TasksModule
4. DailyModule
5. QualityControlModule
6. AcceptanceModule
7. IssuesModule
8. MembersModule
9. PermissionsModule
10. AuditModule
11. SettingsModule

**TODO for Each Module**:
- [ ] Create module directory: `src/app/presentation/modules/{module-name}/`
- [ ] Create module component: `{module-name}.module.component.ts`
- [ ] Implement constructor/input to receive `WorkspaceEventBus`
- [ ] Define module-specific local UI state signals
- [ ] Implement publish/subscribe skeleton for relevant events
- [ ] Add minimal UI template (skeleton only, no business logic)
- [ ] Ensure no imports between modules
- [ ] Ensure no direct workspace-context.store mutations
- [ ] Ensure no use-case calls from modules

#### Phase 5: Handle Domain Event Pattern

**Current** (`handle-domain-event.use-case` not found):
- No existing `handle-domain-event.use-case` found in codebase

**TODO**:
- [ ] Search for existing domain event handling patterns
- [ ] Create `handle-domain-event.use-case.ts` if needed
- [ ] Implement shared event handler/helper to avoid duplicate subscription logic
- [ ] Document event handling flow: Domain Event → Use Case → Event Bus → Module Subscribers

#### Phase 6: Update Documentation

**Files to Update**:
- [ ] README.md (if event bus or module architecture is documented)
- [ ] Architecture diagrams (if any)
- [ ] Update memory-bank files if patterns change

## Decision Points (Require Human Input)

1. **Active Owner State**: Which store should own `activeWorkspaceOwner`/`activeOwner`?
   - Option A: WorkspaceStore (recommended)
   - Option B: New dedicated SelectionStore/Context
   - Option C: IdentityStore

2. **Event Bus Scope**: Should we keep global AppEventBus for app-level events?
   - Option A: Keep AppEventBus for app-level, WorkspaceEventBus for workspace-scoped
   - Option B: Consolidate everything into workspace-scoped event buses
   - Option C: Single global event bus but refactor to signals

3. **Module Initialization**: How should modules receive EventBus?
   - Option A: Constructor injection (requires manual instantiation)
   - Option B: Component @Input() (simpler for Angular components)
   - Option C: Service provider scoped to workspace route

4. **Workspace Runtime**: Where should WorkspaceRuntime be instantiated?
   - Option A: Route resolver
   - Option B: Workspace layout component
   - Option C: Dedicated workspace container component

## Blocking Issues for Implementation

1. ✋ **Conflicting State**: Must resolve duplicate active owner signals before proceeding
2. ✋ **Architecture Decision**: Must decide on workspace-scoped vs global event bus pattern
3. ✋ **Module Structure**: Presentation modules don't exist yet; directory structure needed
4. ✋ **Runtime Pattern**: No existing WorkspaceRuntime or module lifecycle management

## Next Steps (After Consolidation)

Once consolidation decisions are made and conflicts resolved:

1. Implement consolidated state management
2. Create workspace-scoped event bus (signals-only)
3. Create WorkspaceRuntime
4. Implement 11 presentation modules with pub/sub skeleton
5. Add tests for event bus and modules
6. Update documentation
7. Run targeted tests
8. Manual verification

## Recommendation

**Recommended Approach**:

1. **State Consolidation**: 
   - Keep `activeOwner` in `WorkspaceStore` only
   - Remove `activeWorkspaceOwner` from `IdentityStore`
   - `IdentityStore` focuses solely on identity entities

2. **Event Bus Architecture**:
   - Keep global `AppEventBus` for app-level cross-cutting concerns (auth, navigation)
   - Create workspace-scoped `WorkspaceEventBus` for module communication
   - Refactor `AppEventBus` to signals-only over time (separate task)

3. **Module Initialization**:
   - Use Component @Input() for event bus (simpler integration)
   - Workspace layout provides event bus to child modules

4. **Runtime**:
   - Create `WorkspaceRuntime` instantiated in workspace layout component
   - Runtime owns event bus instance and workspace lifecycle

This approach minimizes breaking changes while enabling workspace-scoped module communication.

---

**Generated**: 2024-01-21  
**Status**: Awaiting consolidation decisions before implementation  
**Action Required**: Review and approve consolidation plan, then proceed with implementation

## Architecture Diagrams

### Current State (Conflicting)

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐           │
│  │ IdentityStore   │         │ WorkspaceStore   │           │
│  ├─────────────────┤         ├──────────────────┤           │
│  │ activeWorkspace │  ┌─────>│ activeOwner      │           │
│  │ Owner (signal)  │  │      │ (signal)         │           │
│  │                 │  │      │                  │           │
│  │ selectWorkspace│  │      │ setActiveOwner() │           │
│  │ Owner()────────┼──┘      │                  │           │
│  │   │            │         │ connectOwner     │           │
│  │   │ emits      │         │ Selection()      │           │
│  │   └───────┐    │         │   ^              │           │
│  └───────────┼────┘         └───┼──────────────┘           │
│              │                  │                            │
│              v                  │                            │
│         ┌────────────────────────┘                          │
│         │                                                    │
│  ┌──────▼──────────────────────────────┐                    │
│  │      AppEventBus (Singleton)        │                    │
│  │  ┌────────────────────────────────┐ │                    │
│  │  │ WorkspaceOwnerSelectedEvent   │ │                    │
│  │  │ (RxJS Subject/Observable)     │ │                    │
│  │  └────────────────────────────────┘ │                    │
│  └─────────────────────────────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Issues:
❌ Duplicate state in two stores
❌ RxJS-based (not signals-only)
❌ Global singleton (not workspace-scoped)
```

### Proposed Target State

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐           │
│  │ IdentityStore   │         │ WorkspaceStore   │           │
│  ├─────────────────┤         ├──────────────────┤           │
│  │ users[]         │         │ activeOwner ✓    │           │
│  │ organizations[] │         │ workspaces[]     │           │
│  │ bots[]          │         │                  │           │
│  │                 │         │ setActiveOwner() │           │
│  │ (No active      │         │                  │           │
│  │  owner state)   │         │                  │           │
│  └─────────────────┘         └──────────────────┘           │
│                                      │                       │
│                                      │ owns                  │
│                                      v                       │
│  ┌────────────────────────────────────────────────┐         │
│  │   AppEventBus (Global, App-level events)       │         │
│  │   - Auth events                                │         │
│  │   - Navigation events                          │         │
│  │   (Signals-only, future refactor)              │         │
│  └────────────────────────────────────────────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ creates per workspace
                              v
┌─────────────────────────────────────────────────────────────┐
│                   Workspace Runtime Layer                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────┐               │
│  │      WorkspaceRuntime                    │               │
│  │  ┌────────────────────────────────────┐  │               │
│  │  │ workspaceId: string                │  │               │
│  │  │ eventBus: WorkspaceEventBus        │  │               │
│  │  │   (Signals-only, scoped instance)  │  │               │
│  │  └────────────────────────────────────┘  │               │
│  └──────────────────┬───────────────────────┘               │
│                     │ provides event bus to                 │
│                     v                                        │
└─────────────────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┬──────────────┬─────────┐
        │                           │              │         │
        v                           v              v         v
┌───────────────┐          ┌──────────────┐  ┌─────────┐  ...
│ OverviewModule│          │TasksModule   │  │Settings │
│               │          │              │  │Module   │
│ @Input()      │          │ @Input()     │  │         │
│ eventBus      │          │ eventBus     │  │ @Input()│
│               │          │              │  │ eventBus│
│ - subscribe() │          │ - subscribe()│  │         │
│ - publish()   │          │ - publish()  │  │ - pub() │
│               │          │              │  │ - sub() │
│ Local UI State│          │ Local UI     │  │ Local   │
│ (signals)     │          │ State        │  │ State   │
└───────────────┘          └──────────────┘  └─────────┘

✅ Single source of truth for active owner
✅ Workspace-scoped event bus
✅ Signals-only
✅ No cross-module imports
✅ Modules receive event bus via @Input()
```

### Event Flow

```
Domain Event
    │
    v
┌──────────────────────┐
│ Use Case             │
│ (Application Layer)  │
└──────────┬───────────┘
           │
           │ publishes to
           v
┌──────────────────────────────┐
│ WorkspaceEventBus            │
│ (Workspace Runtime)          │
└───┬──────────────────────┬───┘
    │                      │
    │ notifies all         │ notifies all
    │ subscribers          │ subscribers
    v                      v
┌─────────────┐      ┌──────────────┐
│ ModuleA     │      │ ModuleB      │
│             │      │              │
│ - Updates   │      │ - Updates    │
│   local UI  │      │   local UI   │
│   state     │      │   state      │
│   (signals) │      │   (signals)  │
└─────────────┘      └──────────────┘

No use-case calls ✓
No store mutations ✓
No cross-module imports ✓
```

