import type { MembershipId } from '../value-objects/membership-id.value-object';
import type { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import type { UserId } from '@domain/identity/value-objects/user-id.value-object';

/**
 * Team represents an internal organizational unit with member references.
 * Minimal domain entity enforcing team invariants.
 */
export class Team {
  readonly id: MembershipId;
  readonly type: 'team' = 'team';
  readonly organizationId: OrganizationId;
  readonly memberIds: ReadonlyArray<UserId>;

  private constructor(props: {
    id: MembershipId;
    organizationId: OrganizationId;
    memberIds: ReadonlyArray<UserId>;
  }) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.memberIds = props.memberIds;
  }

  static create(props: {
    id: MembershipId;
    organizationId: OrganizationId;
    memberIds?: ReadonlyArray<UserId>;
  }): Team {
    return new Team({
      id: props.id,
      organizationId: props.organizationId,
      memberIds: props.memberIds ?? [],
    });
  }
}
