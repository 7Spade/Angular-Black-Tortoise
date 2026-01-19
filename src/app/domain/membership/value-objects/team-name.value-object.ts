/**
 * TeamName is a value object enforcing team name validation.
 */
export class TeamName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): TeamName {
    if (!value || value.trim().length === 0) {
      throw new Error('Team name cannot be empty');
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      throw new Error('Team name must be at least 2 characters');
    }
    if (trimmed.length > 100) {
      throw new Error('Team name cannot exceed 100 characters');
    }
    return new TeamName(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TeamName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
