import { Result } from '@domain/shared/types/result.type';
import { ValidationError } from '@domain/shared/errors/domain.error';

/**
 * DisplayName Value Object
 *
 * Represents a validated display name with length constraints (2-50 characters).
 * This is an immutable value object - once created, it cannot be changed.
 *
 * Pure TypeScript - NO framework dependencies.
 */
export class DisplayName {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 50;

  private constructor(private readonly _value: string) {}

  static create(value: string): Result<DisplayName, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(
        new ValidationError('Display name cannot be empty', 'displayName', value),
      );
    }

    const trimmed = value.trim();

    if (trimmed.length < DisplayName.MIN_LENGTH) {
      return Result.fail(
        new ValidationError(
          `Display name must be at least ${DisplayName.MIN_LENGTH} characters`,
          'displayName',
          value,
        ),
      );
    }

    if (trimmed.length > DisplayName.MAX_LENGTH) {
      return Result.fail(
        new ValidationError(
          `Display name must not exceed ${DisplayName.MAX_LENGTH} characters`,
          'displayName',
          value,
        ),
      );
    }

    return Result.ok(new DisplayName(trimmed));
  }

  getValue(): string {
    return this._value;
  }

  equals(other: DisplayName): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
