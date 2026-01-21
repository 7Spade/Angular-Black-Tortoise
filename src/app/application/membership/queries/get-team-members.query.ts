import { Injectable, inject } from '@angular/core';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';

/**
 * GetTeamMembersQuery - Query handler to get members of a team
 */
@Injectable({ providedIn: 'root' })
export class GetTeamMembersQuery {
  private readonly repository = inject<MembershipRepository>(
    'MembershipRepository' as any
  );

  async execute(organizationId: string, teamId: string): Promise<string[]> {
    const teams = await this.repository.getTeams(organizationId);
    const team = teams.find((t) => t.id.getValue() === teamId);
    return team ? [...team.memberIds] : [];
  }
}
