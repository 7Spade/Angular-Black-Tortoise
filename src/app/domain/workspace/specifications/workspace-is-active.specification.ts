import { BaseSpecification } from '@domain/shared/specifications';
import type { WorkspaceAggregate } from '../aggregates/workspace.aggregate';

/**
 * Specification to check if a workspace is in active state.
 * This can be used as a precondition for many operations.
 */
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
