import { Injectable, inject } from '@angular/core';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type { TeamDto } from '../dtos/membership.dto';

/**
 * GetOrganizationTeamsQuery - Query handler to get teams for an organization
 */
@Injectable({ providedIn: 'root' })
export class GetOrganizationTeamsQuery {
  private readonly repository = inject<MembershipRepository>(
    'MembershipRepository' as any
  );

  async execute(organizationId: string): Promise<TeamDto[]> {
    const teams = await this.repository.getTeams(organizationId);
    
    return teams.map((team) => ({
      id: team.id.getValue(),
      organizationId: team.organizationId.getValue(),
      memberIds: [...team.memberIds],
    }));
  }
}
