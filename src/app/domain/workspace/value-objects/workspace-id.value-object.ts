import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * WorkspaceId is a branded identifier for workspace entities.
 * Returns Result<WorkspaceId, ValidationError> to make validation explicit.
 */
export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<WorkspaceId, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('WorkspaceId cannot be empty'));
    }
    return Result.ok(new WorkspaceId(value.trim()));
  }

  /**
   * Alias for create() to match repository method naming conventions
   */
  static fromString(value: string): Result<WorkspaceId, ValidationError> {
    return WorkspaceId.create(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: WorkspaceId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
