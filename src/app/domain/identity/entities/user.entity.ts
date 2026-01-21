import type { UserId } from '../value-objects/user-id.value-object';
import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import type { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';

/**
 * User represents a personal identity that can own workspaces.
 * Minimal domain entity without UI-specific fields.
 */
export class User {
  readonly id: UserId;
  readonly type: 'user' = 'user';
  readonly organizationIds: ReadonlyArray<OrganizationId>;
  readonly teamIds: ReadonlyArray<MembershipId>;
  readonly partnerIds: ReadonlyArray<MembershipId>;
  readonly workspaceIds: ReadonlyArray<WorkspaceId>;

  private constructor(props: {
    id: UserId;
    organizationIds: ReadonlyArray<OrganizationId>;
    teamIds: ReadonlyArray<MembershipId>;
    partnerIds: ReadonlyArray<MembershipId>;
    workspaceIds: ReadonlyArray<WorkspaceId>;
  }) {
    this.id = props.id;
    this.organizationIds = props.organizationIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
    this.workspaceIds = props.workspaceIds;
  }

  static create(props: {
    id: UserId;
    organizationIds?: ReadonlyArray<OrganizationId>;
    teamIds?: ReadonlyArray<MembershipId>;
    partnerIds?: ReadonlyArray<MembershipId>;
    workspaceIds?: ReadonlyArray<WorkspaceId>;
  }): User {
    return new User({
      id: props.id,
      organizationIds: props.organizationIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
      workspaceIds: props.workspaceIds ?? [],
    });
  }
}
