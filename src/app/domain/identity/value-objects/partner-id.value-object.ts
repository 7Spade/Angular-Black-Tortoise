import { ValidationError } from '../../shared/errors';

/**
 * PartnerId is a UUID-based identifier for partners.
 */
export class PartnerId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): PartnerId {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('PartnerId cannot be empty');
    }

    // UUID v4 validation pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(value.trim())) {
      throw new ValidationError('PartnerId must be a valid UUID v4');
    }

    return new PartnerId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PartnerId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
