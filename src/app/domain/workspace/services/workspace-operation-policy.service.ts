import type { WorkspaceAggregate } from '../aggregates/workspace.aggregate';
import { WorkspaceIsActiveSpecification } from '../specifications/workspace-is-active.specification';
import { CanAddModuleSpecification } from '../specifications/can-add-module.specification';
import { AuthorizationError, InvariantViolationError } from '@domain/shared/errors';

/**
 * Domain Service for workspace operation policies.
 * Encapsulates complex business rules using specifications.
 * 
 * DDD Compliance:
 * - Domain service for cross-aggregate or complex logic
 * - Uses specifications for reusable rules
 * - Pure domain logic (no infrastructure dependencies)
 */
export class WorkspaceOperationPolicy {
  private static activeSpec = new WorkspaceIsActiveSpecification();
  private static canAddModuleSpec = new CanAddModuleSpecification();

  /**
   * Check if a workspace can have modules added.
   * Business rule: Workspace must be active AND have quota available.
   */
  static canAddModules(workspace: WorkspaceAggregate): boolean {
    const combinedSpec = this.activeSpec.and(this.canAddModuleSpec);
    return combinedSpec.isSatisfiedBy(workspace);
  }

  /**
   * Enforce that a workspace can have modules added.
   * Throws domain error if not allowed.
   */
  static enforceCanAddModules(workspace: WorkspaceAggregate): void {
    const combinedSpec = this.activeSpec.and(this.canAddModuleSpec);
    if (!combinedSpec.isSatisfiedBy(workspace)) {
      const reason = combinedSpec.getReasonIfNotSatisfied(workspace);
      throw new AuthorizationError(`Cannot add modules to workspace: ${reason}`);
    }
  }

  /**
   * Check if a workspace can be archived.
   * Business rule: Workspace must not be deleted.
   */
  static canArchive(workspace: WorkspaceAggregate): boolean {
    return !workspace.isDeleted();
  }

  /**
   * Enforce that a workspace can be archived.
   */
  static enforceCanArchive(workspace: WorkspaceAggregate): void {
    if (!this.canArchive(workspace)) {
      throw new InvariantViolationError('Cannot archive a deleted workspace');
    }
  }

  /**
   * Check if a workspace can be activated.
   * Business rule: Workspace must not be deleted.
   */
  static canActivate(workspace: WorkspaceAggregate): boolean {
    return !workspace.isDeleted();
  }

  /**
   * Enforce that a workspace can be activated.
   */
  static enforceCanActivate(workspace: WorkspaceAggregate): void {
    if (!this.canActivate(workspace)) {
      throw new InvariantViolationError('Cannot activate a deleted workspace');
    }
  }
}
