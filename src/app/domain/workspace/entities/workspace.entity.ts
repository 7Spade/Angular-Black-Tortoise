import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { WorkspaceStatus } from '../value-objects/workspace-status.value-object';
import type { WorkspaceQuota } from '../value-objects/workspace-quota.value-object';
import type { DisplayName } from '../../identity/value-objects/display-name.value-object';
import type { Timestamp } from '../../shared/value-objects/timestamp.value-object';
import { Result } from '../../shared/types/result.type';
import { DomainError } from '../../shared/errors/domain.error';
import { InvalidStateError } from '../../shared/errors/invalid-state.error';

/**
 * Workspace represents a logical container owned by a user or organization.
 * Domain entity according to STEP 6 requirements with business logic methods.
 */
export class Workspace {
  readonly id: WorkspaceId;
  readonly owner: WorkspaceOwner;
  readonly name: DisplayName;
  readonly status: WorkspaceStatus;
  readonly quota: WorkspaceQuota;
  readonly moduleIds: readonly string[];
  readonly createdAt: Timestamp;

  private constructor(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    name: DisplayName;
    status: WorkspaceStatus;
    quota: WorkspaceQuota;
    moduleIds: readonly string[];
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
    name: DisplayName;
    status: WorkspaceStatus;
    quota: WorkspaceQuota;
    moduleIds?: readonly string[];
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
   * Activate workspace - return Result for state changes
   */
  activate(): Result<Workspace, DomainError> {
    if (this.status.getValue() === 'active') {
      return Result.fail(new InvalidStateError('Workspace is already active'));
    }

    const newStatus = WorkspaceStatus.create('active');
    if (newStatus.isFailure()) {
      return Result.fail(newStatus.error);
    }

    return Result.ok(
      new Workspace({
        ...this,
        status: newStatus.value,
      })
    );
  }

  /**
   * Archive workspace - return Result for state changes
   */
  archive(): Result<Workspace, DomainError> {
    if (this.status.getValue() === 'archived') {
      return Result.fail(new InvalidStateError('Workspace is already archived'));
    }

    if (this.status.getValue() === 'deleted') {
      return Result.fail(
        new InvalidStateError('Cannot archive deleted workspace')
      );
    }

    const newStatus = WorkspaceStatus.create('archived');
    if (newStatus.isFailure()) {
      return Result.fail(newStatus.error);
    }

    return Result.ok(
      new Workspace({
        ...this,
        status: newStatus.value,
      })
    );
  }

  /**
   * Add module to workspace
   */
  addModule(moduleId: string): Result<Workspace, DomainError> {
    if (
      this.status.getValue() === 'archived' ||
      this.status.getValue() === 'deleted'
    ) {
      return Result.fail(
        new InvalidStateError(
          'Cannot add module to archived or deleted workspace'
        )
      );
    }

    if (this.moduleIds.includes(moduleId)) {
      return Result.fail(new InvalidStateError('Module already exists'));
    }

    return Result.ok(
      new Workspace({
        ...this,
        moduleIds: [...this.moduleIds, moduleId],
      })
    );
  }

  /**
   * Remove module from workspace
   */
  removeModule(moduleId: string): Result<Workspace, DomainError> {
    if (
      this.status.getValue() === 'archived' ||
      this.status.getValue() === 'deleted'
    ) {
      return Result.fail(
        new InvalidStateError(
          'Cannot remove module from archived or deleted workspace'
        )
      );
    }

    if (!this.moduleIds.includes(moduleId)) {
      return Result.fail(new InvalidStateError('Module does not exist'));
    }

    return Result.ok(
      new Workspace({
        ...this,
        moduleIds: this.moduleIds.filter((id) => id !== moduleId),
      })
    );
  }

  /**
   * Check equality by workspace id
   */
  equals(other: Workspace): boolean {
    return this.id.equals(other.id);
  }
}
