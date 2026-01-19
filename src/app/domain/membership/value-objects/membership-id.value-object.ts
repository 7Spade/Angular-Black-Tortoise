import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * MembershipId is a branded identifier for membership entities.
 * Returns Result<MembershipId, ValidationError> to make validation explicit.
 */
export class MembershipId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<MembershipId, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('MembershipId cannot be empty'));
    }
    return Result.ok(new MembershipId(value.trim()));
  }

  /**
   * Alias for create() to match repository method naming conventions
   */
  static fromString(value: string): Result<MembershipId, ValidationError> {
    return MembershipId.create(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MembershipId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
