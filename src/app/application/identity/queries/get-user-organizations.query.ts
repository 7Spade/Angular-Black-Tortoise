import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import type { OrganizationDto } from '../dtos/identity.dto';

/**
 * GetUserOrganizationsQuery - Query handler to get organizations for a user
 */
@Injectable({ providedIn: 'root' })
export class GetUserOrganizationsQuery {
  private readonly repository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  execute(userId: string): Observable<OrganizationDto[]> {
    return this.repository.getOrganizations().pipe(
      map((organizations) =>
        organizations
          .filter(
            (org) =>
              org.ownerId === userId || org.memberIds.includes(userId)
          )
          .map((org) => ({
            id: org.id.getValue(),
            type: org.type,
            ownerId: org.ownerId,
            memberIds: [...org.memberIds],
            teamIds: [...org.teamIds],
            partnerIds: [...org.partnerIds],
            workspaceIds: [...org.workspaceIds],
          }))
      )
    );
  }
}
