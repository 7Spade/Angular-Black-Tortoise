# Implementation Blocked - Conflicting Signals Detected

## Summary

**Task**: Implement minimal skeleton publish/subscribe behavior in Presentation Modules with workspace-scoped Event Bus

**Status**: ⛔ **BLOCKED - STOPPED BEFORE CODE CHANGES**

**Reason**: Multiple active signals and conflicting implementations detected per custom instruction requirement.

---

## Conflicts Detected

### 1. Duplicate Active Workspace Owner Signals

Two stores are tracking the same workspace owner selection state:

| Store | Signal | Method | File |
|-------|--------|--------|------|
| **IdentityStore** | `activeWorkspaceOwner` | `selectWorkspaceOwner()` | `src/app/application/stores/identity.store.ts` |
| **WorkspaceStore** | `activeOwner` | `setActiveOwner()` | `src/app/application/stores/workspace.store.ts` |

**Impact**: Violates Single Source of Truth principle. Both stores maintain duplicate state for workspace owner selection.

**Flow**:
```
User Action → IdentityStore.selectWorkspaceOwner() 
  → Emits WorkspaceOwnerSelectedEvent via AppEventBus
  → WorkspaceStore.connectOwnerSelection() listens
  → WorkspaceStore updates activeOwner
```

### 2. Event Bus Architecture Mismatch

**Current Implementation**:
- `AppEventBus` is a **singleton** service (`providedIn: 'root'`)
- Uses **RxJS** `Subject` and `Observable` (not signals-only)
- **Global** event bus for all events

**Requirements Specify**:
- **Workspace-scoped** Event Bus (not singleton)
- **Signals-only** (zone-less, no RxJS Observable)
- Created by **Workspace Runtime** and passed into modules
- Module init via **constructor or input** to receive event bus

**Impact**: Current implementation cannot satisfy requirements without architectural refactoring.

---

## What Was Checked

✅ Explored entire project for Identity/Workspace switcher components  
✅ Analyzed store signals and their relationships  
✅ Reviewed event bus implementation  
✅ Checked for workspace-context.store (none exists)  
✅ Verified module structure (presentation modules don't exist yet)  
✅ Examined existing event flow patterns  

---

## Deliverables

Per the custom instruction requirement to "STOP and output TODO skeleton for consolidation":

1. **Consolidation Plan**: `WORKSPACE_SWITCHER_CONSOLIDATION_TODO.md`
   - Complete analysis of conflicting implementations
   - Phase-by-phase consolidation steps
   - Architecture diagrams (current vs. proposed)
   - Decision points requiring human input
   - Recommended approach

2. **This Document**: Implementation status and blocking issues

---

## Recommended Next Steps

### Before Implementation Can Proceed

1. **Review Consolidation Plan**: Read `WORKSPACE_SWITCHER_CONSOLIDATION_TODO.md`

2. **Make Architecture Decisions**:
   - Which store should own active workspace owner state?
   - Keep global AppEventBus or consolidate to workspace-scoped only?
   - How should modules receive event bus (constructor, @Input, provider)?
   - Where should WorkspaceRuntime be instantiated?

3. **Approve Recommended Approach**:
   - Remove `activeWorkspaceOwner` from `IdentityStore`
   - Keep `activeOwner` in `WorkspaceStore` only
   - Create workspace-scoped `WorkspaceEventBus` (signals-only)
   - Keep global `AppEventBus` for app-level events
   - Use `@Input()` for event bus injection to modules
   - Instantiate `WorkspaceRuntime` in workspace layout component

### After Consolidation Approval

4. **Implement Consolidation**:
   - Refactor stores to eliminate duplicate state
   - Create `WorkspaceEventBus` class (signals-only)
   - Create `WorkspaceRuntime` class
   - Update existing event flow

5. **Implement Module Skeleton**:
   - Create 11 presentation modules (Overview, Documents, Tasks, etc.)
   - Implement minimal pub/sub skeleton
   - Add local UI state signals
   - Ensure no cross-module imports
   - Ensure modules don't mutate stores or call use-cases

6. **Test and Validate**:
   - Add focused tests
   - Run targeted tests
   - Manual verification
   - Update documentation

---

## Files for Review

- `WORKSPACE_SWITCHER_CONSOLIDATION_TODO.md` - Complete consolidation plan with diagrams
- `src/app/application/stores/identity.store.ts` - Store with duplicate signal
- `src/app/application/stores/workspace.store.ts` - Store with duplicate signal
- `src/app/application/event-bus/app-event-bus.service.ts` - Current event bus implementation

---

## Compliance

✅ **Followed Custom Instruction**: "Before code changes, check entire project for Identity/Workspace switcher components and related store signals per custom instruction; if multiple active signals or conflicting implementations exist, STOP and output TODO skeleton for consolidation (no code changes)."

✅ **No Code Changes Made**: Repository remains in original state, ready for consolidation decisions.

✅ **Repository Instructions Followed**: Read all memory-bank files and instruction files as required.

✅ **Comprehensive Analysis**: Provided detailed TODO skeleton with architecture diagrams, decision points, and recommendations.

---

**Generated**: 2024-01-21  
**Action Required**: Review consolidation plan and approve architecture decisions before proceeding with implementation.
