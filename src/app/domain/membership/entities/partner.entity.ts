import type { MembershipId } from '../value-objects/membership-id.value-object';

/**
 * Partner represents an external organizational unit with member references.
 * Minimal domain entity enforcing partner invariants.
 */
export class Partner {
  readonly id: MembershipId;
  readonly type: 'partner' = 'partner';
  readonly name: string;
  readonly organizationId: string;
  readonly memberIds: ReadonlyArray<string>;

  private constructor(props: {
    id: MembershipId;
    name: string;
    organizationId: string;
    memberIds: ReadonlyArray<string>;
  }) {
    if (!props.organizationId || props.organizationId.trim().length === 0) {
      throw new Error('Partner must belong to an organization');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Partner name cannot be empty');
    }
    this.id = props.id;
    this.name = props.name;
    this.organizationId = props.organizationId;
    this.memberIds = props.memberIds;
  }

  static create(props: {
    id: MembershipId;
    name: string;
    organizationId: string;
    memberIds?: ReadonlyArray<string>;
  }): Partner {
    return new Partner({
      id: props.id,
      name: props.name,
      organizationId: props.organizationId,
      memberIds: props.memberIds ?? [],
    });
  }
}
