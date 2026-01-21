/**
 * OrganizationId is a branded identifier for organization entities.
 */
export class OrganizationId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): OrganizationId {
    if (!value || value.trim().length === 0) {
      throw new Error('OrganizationId cannot be empty');
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
