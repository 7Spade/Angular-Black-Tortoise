import { DomainError } from '../../shared/errors';
import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { OrganizationName } from '../value-objects/organization-name.value-object';
import type { OrganizationSlug } from '../value-objects/organization-slug.value-object';
import type { TeamId } from '../value-objects/team-id.value-object';
import type { PartnerId } from '../value-objects/partner-id.value-object';
import type { IdentityId } from '../value-objects/identity-id.value-object';
import { Team, TEAM_FACTORY_TOKEN } from '../entities/team.entity';
import { Partner, PARTNER_FACTORY_TOKEN } from '../entities/partner.entity';

/**
 * Organization aggregate root.
 * Enforces invariants for organization, teams, and partners.
 */
export class Organization {
  readonly id: OrganizationId;
  readonly name: OrganizationName;
  readonly slug: OrganizationSlug;
  private readonly memberIds: Set<string>;
  private readonly teams: Map<string, Team>;
  private readonly partners: Map<string, Partner>;

  private constructor(props: {
    id: OrganizationId;
    name: OrganizationName;
    slug: OrganizationSlug;
    memberIds: ReadonlyArray<IdentityId>;
    teams: ReadonlyArray<Team>;
    partners: ReadonlyArray<Partner>;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.memberIds = new Set(props.memberIds.map(id => id.getValue()));
    this.teams = new Map(props.teams.map(team => [team.id.getValue(), team]));
    this.partners = new Map(props.partners.map(partner => [partner.id.getValue(), partner]));
  }

  /**
   * Creates a new Organization aggregate.
   */
  static createOrganization(props: {
    id: OrganizationId;
    name: OrganizationName;
    slug: OrganizationSlug;
    memberIds?: ReadonlyArray<IdentityId>;
  }): Organization {
    return new Organization({
      id: props.id,
      name: props.name,
      slug: props.slug,
      memberIds: props.memberIds ?? [],
      teams: [],
      partners: [],
    });
  }

  /**
   * Adds a new team to the organization.
   */
  addTeam(teamId: TeamId, initialMemberIds: ReadonlyArray<IdentityId> = []): Organization {
    if (this.teams.has(teamId.getValue())) {
      throw new DomainError(`Team with id ${teamId.getValue()} already exists in this organization`);
    }

    // Invariant: Team members must be organization members
    for (const memberId of initialMemberIds) {
      if (!this.memberIds.has(memberId.getValue())) {
        throw new DomainError(
          `Cannot add member ${memberId.getValue()} to team: member is not part of the organization`
        );
      }
    }

    const team = Team.createForAggregate(TEAM_FACTORY_TOKEN, {
      id: teamId,
      organizationId: this.id,
      memberIds: initialMemberIds,
    });

    const updatedTeams = Array.from(this.teams.values());
    updatedTeams.push(team);

    return new Organization({
      id: this.id,
      name: this.name,
      slug: this.slug,
      memberIds: Array.from(this.memberIds).map(id => ({ getValue: () => id } as IdentityId)),
      teams: updatedTeams,
      partners: Array.from(this.partners.values()),
    });
  }

  /**
   * Adds a new partner to the organization.
   */
  addPartner(partnerId: PartnerId, initialMemberIds: ReadonlyArray<IdentityId> = []): Organization {
    if (this.partners.has(partnerId.getValue())) {
      throw new DomainError(`Partner with id ${partnerId.getValue()} already exists in this organization`);
    }

    // Invariant: Partner members must be external identities (not org members)
    for (const memberId of initialMemberIds) {
      if (this.memberIds.has(memberId.getValue())) {
        throw new DomainError(
          `Cannot add member ${memberId.getValue()} to partner: member is already part of the organization`
        );
      }
    }

    const partner = Partner.createForAggregate(PARTNER_FACTORY_TOKEN, {
      id: partnerId,
      organizationId: this.id,
      memberIds: initialMemberIds,
    });

    const updatedPartners = Array.from(this.partners.values());
    updatedPartners.push(partner);

    return new Organization({
      id: this.id,
      name: this.name,
      slug: this.slug,
      memberIds: Array.from(this.memberIds).map(id => ({ getValue: () => id } as IdentityId)),
      teams: Array.from(this.teams.values()),
      partners: updatedPartners,
    });
  }

  /**
   * Adds a member to an existing team.
   */
  addMemberToTeam(teamId: TeamId, memberId: IdentityId): Organization {
    const team = this.teams.get(teamId.getValue());
    if (!team) {
      throw new DomainError(`Team with id ${teamId.getValue()} does not exist in this organization`);
    }

    // Invariant: Team members must be organization members
    if (!this.memberIds.has(memberId.getValue())) {
      throw new DomainError(
        `Cannot add member ${memberId.getValue()} to team: member is not part of the organization`
      );
    }

    // Check if member is already in the team
    const memberAlreadyInTeam = team.memberIds.some(id => id.getValue() === memberId.getValue());
    if (memberAlreadyInTeam) {
      throw new DomainError(`Member ${memberId.getValue()} is already in team ${teamId.getValue()}`);
    }

    const updatedMemberIds = [...team.memberIds, memberId];
    const updatedTeam = Team.createForAggregate(TEAM_FACTORY_TOKEN, {
      id: team.id,
      organizationId: team.organizationId,
      memberIds: updatedMemberIds,
    });

    const updatedTeams = Array.from(this.teams.values()).map(t =>
      t.id.getValue() === teamId.getValue() ? updatedTeam : t
    );

    return new Organization({
      id: this.id,
      name: this.name,
      slug: this.slug,
      memberIds: Array.from(this.memberIds).map(id => ({ getValue: () => id } as IdentityId)),
      teams: updatedTeams,
      partners: Array.from(this.partners.values()),
    });
  }

  /**
   * Adds a member to an existing partner.
   */
  addMemberToPartner(partnerId: PartnerId, memberId: IdentityId): Organization {
    const partner = this.partners.get(partnerId.getValue());
    if (!partner) {
      throw new DomainError(`Partner with id ${partnerId.getValue()} does not exist in this organization`);
    }

    // Invariant: Partner members must be external identities (not org members)
    if (this.memberIds.has(memberId.getValue())) {
      throw new DomainError(
        `Cannot add member ${memberId.getValue()} to partner: member is already part of the organization`
      );
    }

    // Check if member is already in the partner
    const memberAlreadyInPartner = partner.memberIds.some(id => id.getValue() === memberId.getValue());
    if (memberAlreadyInPartner) {
      throw new DomainError(`Member ${memberId.getValue()} is already in partner ${partnerId.getValue()}`);
    }

    const updatedMemberIds = [...partner.memberIds, memberId];
    const updatedPartner = Partner.createForAggregate(PARTNER_FACTORY_TOKEN, {
      id: partner.id,
      organizationId: partner.organizationId,
      memberIds: updatedMemberIds,
    });

    const updatedPartners = Array.from(this.partners.values()).map(p =>
      p.id.getValue() === partnerId.getValue() ? updatedPartner : p
    );

    return new Organization({
      id: this.id,
      name: this.name,
      slug: this.slug,
      memberIds: Array.from(this.memberIds).map(id => ({ getValue: () => id } as IdentityId)),
      teams: Array.from(this.teams.values()),
      partners: updatedPartners,
    });
  }

  /**
   * Returns all organization members.
   */
  getMembers(): ReadonlyArray<IdentityId> {
    return Array.from(this.memberIds).map(id => ({ getValue: () => id } as IdentityId));
  }

  /**
   * Returns all teams.
   */
  getTeams(): ReadonlyArray<Team> {
    return Array.from(this.teams.values());
  }

  /**
   * Returns all partners.
   */
  getPartners(): ReadonlyArray<Partner> {
    return Array.from(this.partners.values());
  }
}
