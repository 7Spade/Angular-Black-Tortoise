import type { Team } from '../entities/team.entity';
import type { Partner } from '../entities/partner.entity';
import type { OrganizationMembership } from '../entities/organization-membership.entity';

/**
 * MembershipRepository defines the contract for membership persistence.
 * All methods return Promises for non-reactive domain layer.
 */
export interface MembershipRepository {
  getTeams(organizationId: string): Promise<Team[]>;
  getPartners(organizationId: string): Promise<Partner[]>;
  getOrganizationMemberships(organizationId: string): Promise<OrganizationMembership[]>;
}
