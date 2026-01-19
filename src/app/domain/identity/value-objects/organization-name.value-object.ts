import { ValidationError } from '../../shared/errors';

/**
 * OrganizationName value object with validation (2-100 characters).
 */
export class OrganizationName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): OrganizationName {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('OrganizationName cannot be empty');
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length < 2) {
      throw new ValidationError('OrganizationName must be at least 2 characters');
    }

    if (trimmedValue.length > 100) {
      throw new ValidationError('OrganizationName cannot exceed 100 characters');
    }

    return new OrganizationName(trimmedValue);
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
