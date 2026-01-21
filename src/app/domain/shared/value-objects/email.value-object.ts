import { Result } from '../types/result.type';
import { ValidationError } from '../errors/validation.error';

/**
 * Email is a value object enforcing email format validation.
 * Returns Result<Email, ValidationError> to make validation explicit.
 */
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<Email, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('Email cannot be empty'));
    }
    const trimmed = value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return Result.fail(new ValidationError('Invalid email format'));
    }
    return Result.ok(new Email(trimmed));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
