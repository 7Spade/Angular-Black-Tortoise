import type { TeamId } from '../value-objects/team-id.value-object';
import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * Internal token to restrict Team entity construction to Organization aggregate.
 */
export const TEAM_FACTORY_TOKEN = Symbol('TEAM_FACTORY_TOKEN');

/**
 * Team entity represents a team within an organization.
 * Can only be created by the Organization aggregate.
 */
export class Team {
  readonly id: TeamId;
  readonly organizationId: OrganizationId;
  readonly memberIds: ReadonlyArray<IdentityId>;

  private constructor(
    token: symbol,
    props: {
      id: TeamId;
      organizationId: OrganizationId;
      memberIds: ReadonlyArray<IdentityId>;
    }
  ) {
    if (token !== TEAM_FACTORY_TOKEN) {
      throw new Error('Team can only be created by Organization aggregate');
    }
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.memberIds = props.memberIds;
  }

  /**
   * Factory method for Organization aggregate use only.
   */
  static createForAggregate(
    token: symbol,
    props: {
      id: TeamId;
      organizationId: OrganizationId;
      memberIds: ReadonlyArray<IdentityId>;
    }
  ): Team {
    return new Team(token, props);
  }
}
