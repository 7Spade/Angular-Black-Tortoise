import { BaseSpecification } from '@domain/shared/specifications';
import type { WorkspaceAggregate } from '../aggregates/workspace.aggregate';

/**
 * Specification to check if a module can be added to a workspace.
 * Encapsulates the business rule for module addition quota.
 */
export class CanAddModuleSpecification extends BaseSpecification<WorkspaceAggregate> {
  isSatisfiedBy(workspace: WorkspaceAggregate): boolean {
    return workspace.canAddModule();
  }

  getReasonIfNotSatisfied(workspace: WorkspaceAggregate): string | null {
    if (this.isSatisfiedBy(workspace)) {
      return null;
    }
    return `Workspace has reached its module quota limit of ${workspace.getQuota().getMaxProjects()} modules`;
  }
}
