import type { MembershipId } from '../value-objects/membership-id.value-object';
import type { IdentityId } from '../../identity/value-objects/identity-id.value-object';
import type { Email } from '../../identity/value-objects/email.value-object';
import type { DisplayName } from '../../identity/value-objects/display-name.value-object';

/**
 * Partner represents an external organizational unit with member references.
 * Domain entity according to STEP 10 requirements: id, organizationId, name, memberIds, contactEmail.
 */
export class Partner {
  readonly id: MembershipId;
  readonly type: 'partner' = 'partner';
  readonly organizationId: IdentityId;
  readonly name: DisplayName;
  readonly memberIds: ReadonlyArray<string>;
  readonly contactEmail: Email;

  private constructor(props: {
    id: MembershipId;
    organizationId: IdentityId;
    name: DisplayName;
    memberIds: ReadonlyArray<string>;
    contactEmail: Email;
  }) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.memberIds = props.memberIds;
    this.contactEmail = props.contactEmail;
  }

  static create(props: {
    id: MembershipId;
    organizationId: IdentityId;
    name: DisplayName;
    memberIds?: ReadonlyArray<string>;
    contactEmail: Email;
  }): Partner {
    return new Partner({
      id: props.id,
      organizationId: props.organizationId,
      name: props.name,
      memberIds: props.memberIds ?? [],
      contactEmail: props.contactEmail,
    });
  }

  /**
   * Check equality by membership id
   */
  equals(other: Partner): boolean {
    return this.id.equals(other.id);
  }
}

