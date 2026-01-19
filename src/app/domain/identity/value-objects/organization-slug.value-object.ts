import { ValidationError } from '../../shared/errors';

/**
 * OrganizationSlug value object with validation (lowercase a-z, 0-9, hyphens).
 */
export class OrganizationSlug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): OrganizationSlug {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('OrganizationSlug cannot be empty');
    }

    const trimmedValue = value.trim();
    const slugPattern = /^[a-z0-9-]+$/;
    
    if (!slugPattern.test(trimmedValue)) {
      throw new ValidationError('OrganizationSlug must contain only lowercase letters, numbers, and hyphens');
    }

    return new OrganizationSlug(trimmedValue);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrganizationSlug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
