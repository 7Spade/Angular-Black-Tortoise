import { ValidationError } from '../../shared/errors';
import { Result } from '../../shared/types/result.type';

/**
 * DisplayName represents a user's display name.
 */
export class DisplayName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<DisplayName, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('DisplayName cannot be empty'));
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return Result.fail(
        new ValidationError('DisplayName must be at least 2 characters')
      );
    }
    if (trimmed.length > 50) {
      return Result.fail(
        new ValidationError('DisplayName must not exceed 50 characters')
      );
    }
    return Result.ok(new DisplayName(trimmed));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: DisplayName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
