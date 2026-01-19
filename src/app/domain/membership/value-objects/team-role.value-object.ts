/**
 * TeamRole is a value object representing roles within a team.
 * Valid roles: Team Lead, Member
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

  static fromString(value: string): TeamRole {
    const normalized = value.toLowerCase().trim();
    if (normalized === 'team-lead' || normalized === 'teamlead' || normalized === 'lead') {
      return TeamRole.createTeamLead();
    }
    if (normalized === 'member') {
      return TeamRole.createMember();
    }
    throw new Error(`Invalid team role: ${value}. Must be one of: team-lead, member`);
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
