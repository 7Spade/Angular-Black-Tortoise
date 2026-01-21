import { BaseSpecification } from '@domain/shared/specifications';
import type { OrganizationMembership } from '../entities/organization-membership.entity';

/**
 * Specification to check if a membership has admin privileges.
 */
export class MembershipHasAdminPrivilegesSpecification extends BaseSpecification<OrganizationMembership> {
  isSatisfiedBy(membership: OrganizationMembership): boolean {
    return membership.isAdmin();
  }

  getReasonIfNotSatisfied(membership: OrganizationMembership): string | null {
    if (this.isSatisfiedBy(membership)) {
      return null;
    }
    return `Membership does not have admin privileges (current role: ${membership.getRole()})`;
  }
}
