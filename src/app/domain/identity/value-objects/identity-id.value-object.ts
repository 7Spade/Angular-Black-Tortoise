import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * IdentityId is a branded identifier for identity entities.
 * Returns Result<IdentityId, ValidationError> to make validation explicit.
 */
export class IdentityId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<IdentityId, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('IdentityId cannot be empty'));
    }
    return Result.ok(new IdentityId(value.trim()));
  }

  /**
   * Alias for create() to match repository method naming conventions
   */
  static fromString(value: string): Result<IdentityId, ValidationError> {
    return IdentityId.create(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IdentityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
