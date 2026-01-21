import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import type { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';

/**
 * Organization represents an organization identity with member references.
 * Minimal domain entity without UI-specific fields.
 */
export class Organization {
  readonly id: OrganizationId;
  readonly type: 'organization' = 'organization';
  readonly memberIds: ReadonlyArray<MembershipId>;
  readonly teamIds: ReadonlyArray<MembershipId>;
  readonly partnerIds: ReadonlyArray<MembershipId>;
  readonly workspaceIds: ReadonlyArray<WorkspaceId>;

  private constructor(props: {
    id: OrganizationId;
    memberIds: ReadonlyArray<MembershipId>;
    teamIds: ReadonlyArray<MembershipId>;
    partnerIds: ReadonlyArray<MembershipId>;
    workspaceIds: ReadonlyArray<WorkspaceId>;
  }) {
    this.id = props.id;
    this.memberIds = props.memberIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
    this.workspaceIds = props.workspaceIds;
  }

  static create(props: {
    id: OrganizationId;
    memberIds?: ReadonlyArray<MembershipId>;
    teamIds?: ReadonlyArray<MembershipId>;
    partnerIds?: ReadonlyArray<MembershipId>;
    workspaceIds?: ReadonlyArray<WorkspaceId>;
  }): Organization {
    return new Organization({
      id: props.id,
      memberIds: props.memberIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
      workspaceIds: props.workspaceIds ?? [],
    });
  }
}
