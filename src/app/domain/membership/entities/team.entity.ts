import type { MembershipId } from '../value-objects/membership-id.value-object';
import type { IdentityId } from '../../identity/value-objects/identity-id.value-object';
import type { DisplayName } from '../../identity/value-objects/display-name.value-object';

/**
 * Team represents an internal organizational unit with member references.
 * Domain entity according to STEP 10 requirements: id, organizationId, name, memberIds.
 */
export class Team {
  readonly id: MembershipId;
  readonly type: 'team' = 'team';
  readonly organizationId: IdentityId;
  readonly name: DisplayName;
  readonly memberIds: readonly string[];

  private constructor(props: {
    id: MembershipId;
    organizationId: IdentityId;
    name: DisplayName;
    memberIds: readonly string[];
  }) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.memberIds = props.memberIds;
  }

  static create(props: {
    id: MembershipId;
    organizationId: IdentityId;
    name: DisplayName;
    memberIds?: readonly string[];
  }): Team {
    return new Team({
      id: props.id,
      organizationId: props.organizationId,
      name: props.name,
      memberIds: props.memberIds ?? [],
    });
  }

  /**
   * Check equality by membership id
   */
  equals(other: Team): boolean {
    return this.id.equals(other.id);
  }
}

