import type { Team } from '../entities/team.entity';
import type { Partner } from '../entities/partner.entity';
import type { OrganizationMembership } from '../entities/organization-membership.entity';

/**
 * MembershipRepository defines the contract for membership persistence.
 * Returns Promises for framework-agnostic async operations (DDD requirement).
 */
export interface MembershipRepository {
  getTeams(organizationId: string): Promise<Team[]>;
  getPartners(organizationId: string): Promise<Partner[]>;
  getOrganizationMemberships(organizationId: string): Promise<OrganizationMembership[]>;
}
