import { Result } from '@domain/shared/types/result.type';
import { ValidationError } from '@domain/shared/errors/domain.error';

/**
 * Email Value Object
 *
 * Represents a validated email address following RFC 5322 standard.
 * This is an immutable value object - once created, it cannot be changed.
 *
 * Pure TypeScript - NO framework dependencies.
 */
export class Email {
  private constructor(private readonly _value: string) {}

  static create(value: string): Result<Email, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(
        new ValidationError('Email cannot be empty', 'email', value),
      );
    }

    // RFC 5322 Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Result.fail(
        new ValidationError('Invalid email format', 'email', value),
      );
    }

    return Result.ok(new Email(value.toLowerCase().trim()));
  }

  getValue(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
