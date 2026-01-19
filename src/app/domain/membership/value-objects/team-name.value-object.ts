import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * TeamName is a value object enforcing team name validation.
 * Returns Result<TeamName, ValidationError> to make validation explicit.
 */
export class TeamName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<TeamName, ValidationError> {
    if (!value || value.trim().length === 0) {
      return Result.fail(new ValidationError('Team name cannot be empty'));
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return Result.fail(new ValidationError('Team name must be at least 2 characters'));
    }
    if (trimmed.length > 100) {
      return Result.fail(new ValidationError('Team name cannot exceed 100 characters'));
    }
    return Result.ok(new TeamName(trimmed));
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
