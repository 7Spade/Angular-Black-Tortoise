import { Injectable, inject } from '@angular/core';
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

  async execute(userId: string): Promise<UserDto | null> {
    const users = await this.repository.getUsers();
    const user = users.find((u) => u.id.getValue() === userId);
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id.getValue(),
      type: user.type,
      email: user.email.getValue(),
      displayName: user.displayName.getValue(),
      status: user.status.getValue(),
      createdAt: user.createdAt.getValue().toISOString(),
    };
  }
}
