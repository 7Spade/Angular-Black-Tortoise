/**
 * BotId is a branded identifier for bot entities.
 */
export class BotId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): BotId {
    if (!value || value.trim().length === 0) {
      throw new Error('BotId cannot be empty');
    }
    return new BotId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BotId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
