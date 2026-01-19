/**
 * PartnerName is a value object enforcing partner name validation.
 */
export class PartnerName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): PartnerName {
    if (!value || value.trim().length === 0) {
      throw new Error('Partner name cannot be empty');
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      throw new Error('Partner name must be at least 2 characters');
    }
    if (trimmed.length > 100) {
      throw new Error('Partner name cannot exceed 100 characters');
    }
    return new PartnerName(trimmed);
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
