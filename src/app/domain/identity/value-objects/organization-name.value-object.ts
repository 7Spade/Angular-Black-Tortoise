import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * OrganizationName is a value object enforcing organization name validation.
 * Returns Result<OrganizationName, ValidationError> to make validation explicit.
 */
export class OrganizationName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<OrganizationName, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('Organization name cannot be empty'));
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return Result.fail(new ValidationError('Organization name must be at least 2 characters'));
    }
    if (trimmed.length > 100) {
      return Result.fail(new ValidationError('Organization name cannot exceed 100 characters'));
    }
    return Result.ok(new OrganizationName(trimmed));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrganizationName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
