import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type { UserDto } from '@application/identity/dtos/identity.dto';

/**
 * GetTeamMembersQuery - Query handler to get members of a team
 */
@Injectable({ providedIn: 'root' })
export class GetTeamMembersQuery {
  private readonly repository = inject<MembershipRepository>(
    'MembershipRepository' as any
  );

  execute(organizationId: string, teamId: string): Observable<string[]> {
    return this.repository.getTeams(organizationId).pipe(
      map((teams) => {
        const team = teams.find((t) => t.id.getValue() === teamId);
        return team ? [...team.memberIds] : [];
      })
    );
  }
}
