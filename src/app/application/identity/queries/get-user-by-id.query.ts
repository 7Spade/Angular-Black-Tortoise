import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import type { UserDto } from '../dtos/identity.dto';

/**
 * GetUserByIdQuery - Query handler to get a user by ID
 */
@Injectable({ providedIn: 'root' })
export class GetUserByIdQuery {
  private readonly repository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  execute(userId: string): Observable<UserDto | null> {
    return this.repository.getUsers().pipe(
      map((users) => {
        const user = users.find((u) => u.id.getValue() === userId);
        if (!user) {
          return null;
        }
        return {
          id: user.id.getValue(),
          type: user.type,
          organizationIds: [...user.organizationIds],
          teamIds: [...user.teamIds],
          partnerIds: [...user.partnerIds],
          workspaceIds: [...user.workspaceIds],
        };
      })
    );
  }
}
