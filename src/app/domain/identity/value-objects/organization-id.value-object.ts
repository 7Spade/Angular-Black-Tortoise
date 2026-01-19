import { ValidationError } from '../../shared/errors';

/**
 * OrganizationId is a UUID-based identifier for organizations.
 */
export class OrganizationId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): OrganizationId {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('OrganizationId cannot be empty');
    }

    // UUID v4 validation pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(value.trim())) {
      throw new ValidationError('OrganizationId must be a valid UUID v4');
    }

    return new OrganizationId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrganizationId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
