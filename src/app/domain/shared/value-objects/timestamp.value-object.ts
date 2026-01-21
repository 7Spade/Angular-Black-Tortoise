import { Result } from '../types/result.type';
import { ValidationError } from '../errors/validation.error';

/**
 * Timestamp is a value object wrapping Date with domain semantics.
 * Returns Result<Timestamp, ValidationError> for invalid dates.
 */
export class Timestamp {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  static create(value: Date | string | number): Result<Timestamp, ValidationError> {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return Result.fail(new ValidationError('Invalid timestamp'));
    }
    return Result.ok(new Timestamp(date));
  }

  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  /**
   * Create Timestamp from milliseconds since epoch.
   */
  static fromMilliseconds(ms: number): Result<Timestamp, ValidationError> {
    return Timestamp.create(ms);
  }

  getValue(): Date {
    return new Date(this.value);
  }

  /**
   * Get timestamp as milliseconds since epoch.
   */
  toMilliseconds(): number {
    return this.value.getTime();
  }

  equals(other: Timestamp): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  isBefore(other: Timestamp): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  isAfter(other: Timestamp): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  toISOString(): string {
    return this.value.toISOString();
  }

  toString(): string {
    return this.value.toISOString();
  }
}
