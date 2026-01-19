import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import type { UserDto } from '../dtos/identity.dto';

/**
 * GetOrganizationMembersQuery - Query handler to get members of an organization
 */
@Injectable({ providedIn: 'root' })
export class GetOrganizationMembersQuery {
  private readonly repository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  execute(organizationId: string): Observable<UserDto[]> {
    return combineLatest([
      this.repository.getOrganizations(),
      this.repository.getUsers(),
    ]).pipe(
      map(([organizations, users]) => {
        const org = organizations.find(
          (o) => o.id.getValue() === organizationId
        );
        if (!org) {
          return [];
        }
        const memberIds = [org.ownerId, ...org.memberIds];
        return users
          .filter((user) => memberIds.includes(user.id.getValue()))
          .map((user) => ({
            id: user.id.getValue(),
            type: user.type,
            organizationIds: [...user.organizationIds],
            teamIds: [...user.teamIds],
            partnerIds: [...user.partnerIds],
            workspaceIds: [...user.workspaceIds],
          }));
      })
    );
  }
}
