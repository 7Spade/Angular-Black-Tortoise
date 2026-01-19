/**
 * OrganizationName is a value object enforcing organization name validation.
 */
export class OrganizationName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): OrganizationName {
    if (!value || value.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      throw new Error('Organization name must be at least 2 characters');
    }
    if (trimmed.length > 100) {
      throw new Error('Organization name cannot exceed 100 characters');
    }
    return new OrganizationName(trimmed);
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
