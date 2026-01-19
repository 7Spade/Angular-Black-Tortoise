import { ValidationError } from '../../shared/errors';
import { Result } from '../../shared/types/result.type';

/**
 * WorkspaceStatus represents the lifecycle status of a workspace.
 */
export type WorkspaceStatusValue = 'active' | 'archived' | 'deleted';

export class WorkspaceStatus {
  private readonly value: WorkspaceStatusValue;

  private constructor(value: WorkspaceStatusValue) {
    this.value = value;
  }

  static create(
    value: string
  ): Result<WorkspaceStatus, ValidationError> {
    const validStatuses: WorkspaceStatusValue[] = [
      'active',
      'archived',
      'deleted',
    ];
    if (!validStatuses.includes(value as WorkspaceStatusValue)) {
      return Result.fail(
        new ValidationError(
          `Invalid workspace status. Must be one of: ${validStatuses.join(', ')}`
        )
      );
    }
    return Result.ok(new WorkspaceStatus(value as WorkspaceStatusValue));
  }

  static active(): WorkspaceStatus {
    return new WorkspaceStatus('active');
  }

  static archived(): WorkspaceStatus {
    return new WorkspaceStatus('archived');
  }

  static deleted(): WorkspaceStatus {
    return new WorkspaceStatus('deleted');
  }

  getValue(): WorkspaceStatusValue {
    return this.value;
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isArchived(): boolean {
    return this.value === 'archived';
  }

  isDeleted(): boolean {
    return this.value === 'deleted';
  }

  canModify(): boolean {
    return this.value === 'active';
  }

  equals(other: WorkspaceStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
