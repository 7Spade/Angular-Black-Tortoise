import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { Email } from '../value-objects/email.value-object';
import type { DisplayName } from '../value-objects/display-name.value-object';

/**
 * User represents a personal identity that can own workspaces.
 * Minimal domain entity without UI-specific fields.
 */
export class User {
  readonly id: IdentityId;
  readonly email: Email;
  readonly displayName: DisplayName | null;
  readonly type: 'user' = 'user';
  readonly organizationIds: ReadonlyArray<string>;
  readonly teamIds: ReadonlyArray<string>;
  readonly partnerIds: ReadonlyArray<string>;
  readonly workspaceIds: ReadonlyArray<string>;

  private constructor(props: {
    id: IdentityId;
    email: Email;
    displayName?: DisplayName | null;
    organizationIds: ReadonlyArray<string>;
    teamIds: ReadonlyArray<string>;
    partnerIds: ReadonlyArray<string>;
    workspaceIds: ReadonlyArray<string>;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.displayName = props.displayName ?? null;
    this.organizationIds = props.organizationIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
    this.workspaceIds = props.workspaceIds;
  }

  static create(props: {
    id: IdentityId;
    email: Email;
    displayName?: DisplayName | null;
    organizationIds?: ReadonlyArray<string>;
    teamIds?: ReadonlyArray<string>;
    partnerIds?: ReadonlyArray<string>;
    workspaceIds?: ReadonlyArray<string>;
  }): User {
    return new User({
      id: props.id,
      email: props.email,
      displayName: props.displayName ?? null,
      organizationIds: props.organizationIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
      workspaceIds: props.workspaceIds ?? [],
    });
  }
}
