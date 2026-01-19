import { Injectable, inject } from '@angular/core';
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

  async execute(organizationId: string): Promise<UserDto[]> {
    const [organizations, users] = await Promise.all([
      this.repository.getOrganizations(),
      this.repository.getUsers(),
    ]);
    
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
        email: user.email.getValue(),
        displayName: user.displayName.getValue(),
        status: user.status.getValue(),
      }));
  }
}
