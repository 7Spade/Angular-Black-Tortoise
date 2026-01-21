import { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

/**
 * WorkspaceOwner encapsulates workspace ownership information with typed IDs.
 */
export class WorkspaceOwner {
  private readonly userId: UserId | null;
  private readonly organizationId: OrganizationId | null;
  readonly type: WorkspaceOwnerType;

  private constructor(
    userId: UserId | null,
    organizationId: OrganizationId | null,
    type: WorkspaceOwnerType
  ) {
    this.userId = userId;
    this.organizationId = organizationId;
    this.type = type;
  }

  static createUserOwner(userId: UserId): WorkspaceOwner {
    return new WorkspaceOwner(userId, null, 'user');
  }

  static createOrganizationOwner(organizationId: OrganizationId): WorkspaceOwner {
    return new WorkspaceOwner(null, organizationId, 'organization');
  }

  static create(props: { id: UserId | OrganizationId; type: WorkspaceOwnerType }): WorkspaceOwner {
    if (props.type === 'user') {
      if (!(props.id instanceof UserId)) {
        throw new Error('WorkspaceOwner requires UserId for user ownership');
      }
      return WorkspaceOwner.createUserOwner(props.id);
    }
    if (!(props.id instanceof OrganizationId)) {
      throw new Error('WorkspaceOwner requires OrganizationId for organization ownership');
    }
    return WorkspaceOwner.createOrganizationOwner(props.id);
  }

  getUserId(): UserId {
    if (!this.userId) {
      throw new Error('WorkspaceOwner is not user-owned');
    }
    return this.userId;
  }

  getOrganizationId(): OrganizationId {
    if (!this.organizationId) {
      throw new Error('WorkspaceOwner is not organization-owned');
    }
    return this.organizationId;
  }

  equals(other: WorkspaceOwner): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (this.type === 'user') {
      return this.userId!.equals(other.userId!);
    }
    return this.organizationId!.equals(other.organizationId!);
  }

  isUserOwned(): boolean {
    return this.type === 'user';
  }

  isOrganizationOwned(): boolean {
    return this.type === 'organization';
  }
}
