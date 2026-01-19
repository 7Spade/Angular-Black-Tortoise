import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { User } from '@domain/identity/entities/user.entity';
import { Email } from '@domain/identity/value-objects/email.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { IdentityStatus } from '@domain/identity/value-objects/identity-status.value-object';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';
import { ValidationError } from '@domain/shared/errors/validation.error';

/**
 * CreateUserCommand - Command to create a new user
 */
export interface CreateUserCommand {
  email: string;
  displayName: string;
}

/**
 * CreateUserCommandHandler - Handler for creating a new user
 */
@Injectable({ providedIn: 'root' })
export class CreateUserCommandHandler {
  private readonly repository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  async execute(command: CreateUserCommand): Promise<Result<string, DomainError>> {
    try {
      // Validate email
      const emailResult = Email.create(command.email);
      if (!emailResult.isOk) {
        return Result.fail(emailResult.error);
      }

      // Validate display name
      const displayNameResult = DisplayName.create(command.displayName);
      if (!displayNameResult.isOk) {
        return Result.fail(displayNameResult.error);
      }

      // Check if user already exists
      const existingUser = await firstValueFrom(
        this.repository.getUserByEmail?.(emailResult.value) ?? Promise.resolve(null) as any
      );
      
      if (existingUser) {
        return Result.fail(
          new ValidationError('User with this email already exists')
        );
      }

      // Create user entity
      const userId = IdentityId.create();
      const status = IdentityStatus.create('active');
      
      if (!status.isOk) {
        return Result.fail(status.error);
      }

      const user = User.create({
        id: userId,
        email: emailResult.value,
        displayName: displayNameResult.value,
        status: status.value,
        organizationIds: [],
        teamIds: [],
        partnerIds: [],
        workspaceIds: [],
      });

      // Save user
      await this.repository.saveUser?.(user);

      return Result.ok(userId.getValue());
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : 'Failed to create user'
        )
      );
    }
  }
}
