import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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

  execute(organizationId: string): Observable<TeamDto[]> {
    return this.repository.getTeams(organizationId).pipe(
      map((teams) =>
        teams.map((team) => ({
          id: team.id.getValue(),
          organizationId: team.organizationId.getValue(),
          memberIds: [...team.memberIds],
        }))
      )
    );
  }
}
