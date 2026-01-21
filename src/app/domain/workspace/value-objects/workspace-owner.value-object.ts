import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

/**
 * WorkspaceOwner encapsulates workspace ownership information.
 */
export class WorkspaceOwner {
  readonly id: string;
  readonly type: WorkspaceOwnerType;

  private constructor(id: string, type: WorkspaceOwnerType) {
    this.id = id;
    this.type = type;
  }

  static create(props: {
    id: string;
    type: WorkspaceOwnerType;
  }): WorkspaceOwner {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('WorkspaceOwner id cannot be empty');
    }
    if (props.type !== 'user' && props.type !== 'organization') {
      throw new Error('WorkspaceOwner type must be user or organization');
    }
    return new WorkspaceOwner(props.id.trim(), props.type);
  }

  equals(other: WorkspaceOwner): boolean {
    return this.id === other.id && this.type === other.type;
  }

  isUserOwned(): boolean {
    return this.type === 'user';
  }

  isOrganizationOwned(): boolean {
    return this.type === 'organization';
  }
}
