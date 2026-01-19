import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { DisplayName } from '../value-objects/display-name.value-object';

/**
 * Organization represents an organization identity with member references.
 * Minimal domain entity without UI-specific fields.
 */
export class Organization {
  readonly id: IdentityId;
  readonly name: DisplayName;
  readonly ownerId: IdentityId;
  readonly type: 'organization' = 'organization';
  readonly memberIds: ReadonlyArray<string>;
  readonly teamIds: ReadonlyArray<string>;
  readonly partnerIds: ReadonlyArray<string>;
  readonly workspaceIds: ReadonlyArray<string>;

  private constructor(props: {
    id: IdentityId;
    name: DisplayName;
    ownerId: IdentityId;
    memberIds: ReadonlyArray<string>;
    teamIds: ReadonlyArray<string>;
    partnerIds: ReadonlyArray<string>;
    workspaceIds: ReadonlyArray<string>;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.ownerId = props.ownerId;
    this.memberIds = props.memberIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
    this.workspaceIds = props.workspaceIds;
  }

  static create(props: {
    id: IdentityId;
    name: DisplayName;
    ownerId: IdentityId;
    memberIds?: ReadonlyArray<string>;
    teamIds?: ReadonlyArray<string>;
    partnerIds?: ReadonlyArray<string>;
    workspaceIds?: ReadonlyArray<string>;
  }): Organization {
    return new Organization({
      id: props.id,
      name: props.name,
      ownerId: props.ownerId,
      memberIds: props.memberIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
      workspaceIds: props.workspaceIds ?? [],
    });
  }
}
