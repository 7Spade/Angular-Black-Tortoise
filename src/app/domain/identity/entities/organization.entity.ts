import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { DisplayName } from '../value-objects/display-name.value-object';

/**
 * Organization represents an organization identity with owner and member references.
 * Domain entity according to STEP 3 requirements.
 */
export class Organization {
  readonly id: IdentityId;
  readonly type: 'organization' = 'organization';
  readonly ownerId: IdentityId;
  readonly name: DisplayName;
  readonly memberIds: readonly string[];
  readonly teamIds: readonly string[];
  readonly partnerIds: readonly string[];

  private constructor(props: {
    id: IdentityId;
    ownerId: IdentityId;
    name: DisplayName;
    memberIds: readonly string[];
    teamIds: readonly string[];
    partnerIds: readonly string[];
  }) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.memberIds = props.memberIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
  }

  static create(props: {
    id: IdentityId;
    ownerId: IdentityId;
    name: DisplayName;
    memberIds?: readonly string[];
    teamIds?: readonly string[];
    partnerIds?: readonly string[];
  }): Organization {
    return new Organization({
      id: props.id,
      ownerId: props.ownerId,
      name: props.name,
      memberIds: props.memberIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
    });
  }

  /**
   * Check equality by identity id
   */
  equals(other: Organization): boolean {
    return this.id.equals(other.id);
  }
}
