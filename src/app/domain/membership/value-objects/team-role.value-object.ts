import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * TeamRole is a value object representing roles within a team.
 * Valid roles: Team Lead, Member
 * Returns Result<TeamRole, ValidationError> for invalid roles.
 */
export class TeamRole {
  private readonly value: 'team-lead' | 'member';

  private constructor(value: 'team-lead' | 'member') {
    this.value = value;
  }

  static createTeamLead(): TeamRole {
    return new TeamRole('team-lead');
  }

  static createMember(): TeamRole {
    return new TeamRole('member');
  }

  static fromString(value: string): Result<TeamRole, ValidationError> {
    const normalized = value.toLowerCase().trim();
    if (normalized === 'team-lead' || normalized === 'teamlead' || normalized === 'lead') {
      return Result.ok(TeamRole.createTeamLead());
    }
    if (normalized === 'member') {
      return Result.ok(TeamRole.createMember());
    }
    return Result.fail(
      new ValidationError(`Invalid team role: ${value}. Must be one of: team-lead, member`)
    );
  }

  isTeamLead(): boolean {
    return this.value === 'team-lead';
  }

  isMember(): boolean {
    return this.value === 'member';
  }

  canManageTeam(): boolean {
    return this.value === 'team-lead';
  }

  getValue(): 'team-lead' | 'member' {
    return this.value;
  }

  equals(other: TeamRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
