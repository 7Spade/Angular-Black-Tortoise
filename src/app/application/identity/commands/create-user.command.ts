import { Injectable, inject } from '@angular/core';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { User } from '@domain/identity/entities/user.entity';
import { Email } from '@domain/shared/value-objects/email.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { IdentityStatus } from '@domain/identity/value-objects/identity-status.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
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
      if (emailResult.isFailure()) {
        return Result.fail(emailResult.getError());
      }

      // Validate display name
      const displayNameResult = DisplayName.create(command.displayName);
      if (displayNameResult.isFailure()) {
        return Result.fail(displayNameResult.getError());
      }

      // Check if user already exists
      const existingUser = await this.repository.findUserByEmail(emailResult.getValue());
      
      if (existingUser) {
        return Result.fail(
          new ValidationError('User with this email already exists')
        );
      }

      // Create user entity
      const userIdResult = IdentityId.create(crypto.randomUUID());
      if (!userIdResult.isOk) {
        return Result.fail(userIdResult.error);
      }

      const statusResult = IdentityStatus.create('active');
      
      if (statusResult.isFailure()) {
        return Result.fail(statusResult.getError());
      }

      const timestampResult = Timestamp.create(new Date());
      if (!timestampResult.isOk) {
        return Result.fail(timestampResult.error);
      }

      const user = User.create({
        id: userIdResult.value,
        email: emailResult.getValue(),
        displayName: displayNameResult.getValue(),
        status: statusResult.getValue(),
        createdAt: timestampResult.value,
      });

      // Save user
      await this.repository.saveUser(user);

      return Result.ok(userIdResult.value.getValue());
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : 'Failed to create user'
        )
      );
    }
  }
}
