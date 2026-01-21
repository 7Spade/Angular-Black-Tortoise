import { BaseSpecification } from '@domain/shared/specifications';
import type { OrganizationMembership } from '../entities/organization-membership.entity';

/**
 * Specification to check if a membership is active.
 */
export class MembershipIsActiveSpecification extends BaseSpecification<OrganizationMembership> {
  isSatisfiedBy(membership: OrganizationMembership): boolean {
    return membership.isActive();
  }

  getReasonIfNotSatisfied(membership: OrganizationMembership): string | null {
    if (this.isSatisfiedBy(membership)) {
      return null;
    }
    return `Membership is not active (current status: ${membership.getStatus()})`;
  }
}
