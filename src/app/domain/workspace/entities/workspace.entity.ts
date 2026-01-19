import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { WorkspaceName } from '../value-objects/workspace-name.value-object';
import type { WorkspaceStatus } from '../value-objects/workspace-status.value-object';
import type { WorkspaceQuota } from '../value-objects/workspace-quota.value-object';
import type { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';

/**
 * Workspace represents a logical container owned by a user or organization only.
 * Domain entity with business rules and validation.
 */
export class Workspace {
  readonly id: WorkspaceId;
  readonly owner: WorkspaceOwner;
  readonly name: WorkspaceName;
  readonly status: WorkspaceStatus;
  readonly quota: WorkspaceQuota;
  readonly moduleIds: ReadonlyArray<string>;
  readonly createdAt: Timestamp;

  private constructor(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    name: WorkspaceName;
    status: WorkspaceStatus;
    quota: WorkspaceQuota;
    moduleIds: ReadonlyArray<string>;
    createdAt: Timestamp;
  }) {
    this.id = props.id;
    this.owner = props.owner;
    this.name = props.name;
    this.status = props.status;
    this.quota = props.quota;
    this.moduleIds = props.moduleIds;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    name: WorkspaceName;
    status: WorkspaceStatus;
    quota: WorkspaceQuota;
    moduleIds?: ReadonlyArray<string>;
    createdAt: Timestamp;
  }): Workspace {
    return new Workspace({
      id: props.id,
      owner: props.owner,
      name: props.name,
      status: props.status,
      quota: props.quota,
      moduleIds: props.moduleIds ?? [],
      createdAt: props.createdAt,
    });
  }

  /**
   * Business logic: Check if workspace can be modified
   */
  canBeModified(): boolean {
    return this.status.isActive();
  }

  /**
   * Business logic: Check if workspace can add more modules
   */
  canAddModule(): boolean {
    return (
      this.status.isActive() &&
      this.quota.canAddProjects(this.moduleIds.length, 1)
    );
  }
}
