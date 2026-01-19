import { ValidationError } from '../../shared/errors';
import { Result } from '../../shared/types/result.type';

/**
 * ModuleKey represents a unique alphanumeric identifier for a workspace module.
 */
export class ModuleKey {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<ModuleKey, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('ModuleKey cannot be empty'));
    }
    const trimmed = value.trim().toLowerCase();
    // Alphanumeric with hyphens and underscores allowed
    const moduleKeyRegex = /^[a-z0-9_-]+$/;
    if (!moduleKeyRegex.test(trimmed)) {
      return Result.fail(
        new ValidationError(
          'ModuleKey must contain only lowercase alphanumeric characters, hyphens, and underscores'
        )
      );
    }
    if (trimmed.length < 2) {
      return Result.fail(
        new ValidationError('ModuleKey must be at least 2 characters')
      );
    }
    if (trimmed.length > 50) {
      return Result.fail(
        new ValidationError('ModuleKey must not exceed 50 characters')
      );
    }
    return Result.ok(new ModuleKey(trimmed));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ModuleKey): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
