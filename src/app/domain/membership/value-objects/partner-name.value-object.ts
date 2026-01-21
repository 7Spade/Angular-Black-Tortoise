import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * PartnerName is a value object enforcing partner name validation.
 * Returns Result<PartnerName, ValidationError> to make validation explicit.
 */
export class PartnerName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<PartnerName, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('Partner name cannot be empty'));
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return Result.fail(new ValidationError('Partner name must be at least 2 characters'));
    }
    if (trimmed.length > 100) {
      return Result.fail(new ValidationError('Partner name cannot exceed 100 characters'));
    }
    return Result.ok(new PartnerName(trimmed));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PartnerName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
