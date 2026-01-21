import type { Team } from '../entities/team.entity';
import type { Partner } from '../entities/partner.entity';
import type { OrganizationMembership } from '../entities/organization-membership.entity';
import type { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';

/**
 * MembershipRepository defines the contract for membership persistence.
 * All methods return Promises for non-reactive domain layer.
 */
export interface MembershipRepository {
  getTeams(organizationId: OrganizationId): Promise<Team[]>;
  getPartners(organizationId: OrganizationId): Promise<Partner[]>;
  getOrganizationMemberships(
    organizationId: OrganizationId,
  ): Promise<OrganizationMembership[]>;
}
