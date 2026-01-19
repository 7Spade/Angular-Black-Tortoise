import { Injectable, inject } from '@angular/core';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Organization } from '@domain/identity/entities/organization.entity';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';
import { NotFoundError } from '@domain/shared/errors/not-found.error';
import { ValidationError } from '@domain/shared/errors/validation.error';

/**
 * AddOrganizationMemberCommand - Command to add a member to an organization
 */
export interface AddOrganizationMemberCommand {
  organizationId: string;
  userId: string;
}

/**
 * AddOrganizationMemberCommandHandler - Handler for adding a member to an organization
 */
@Injectable({ providedIn: 'root' })
export class AddOrganizationMemberCommandHandler {
  private readonly repository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  async execute(
    command: AddOrganizationMemberCommand
  ): Promise<Result<void, DomainError>> {
    try {
      // Validate organization ID
      const orgIdResult = IdentityId.fromString(command.organizationId);
      if (!orgIdResult.isOk) {
        return Result.fail(orgIdResult.error);
      }

      // Validate user ID
      const userIdResult = IdentityId.fromString(command.userId);
      if (!userIdResult.isOk) {
        return Result.fail(userIdResult.error);
      }

      // Find organization
      const organization = await this.repository.findOrganizationById?.(
        orgIdResult.value
      );

      if (!organization) {
        return Result.fail(
          new NotFoundError(
            `Organization with id ${command.organizationId} not found`
          )
        );
      }

      // Find user (verify exists)
      const user = await this.repository.findUserById?.(userIdResult.value);

      if (!user) {
        return Result.fail(
          new NotFoundError(`User with id ${command.userId} not found`)
        );
      }

      // Check if user is already a member
      if (organization.memberIds.includes(command.userId)) {
        return Result.fail(
          new ValidationError('User is already a member of this organization')
        );
      }

      // Use domain method to add member
      const addMemberResult = organization.addMember(command.userId);
      if (!addMemberResult.isOk) {
        return Result.fail(addMemberResult.error);
      }

      // Save organization with new member
      await this.repository.saveOrganization?.(organization);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error
            ? error.message
            : 'Failed to add organization member'
        )
      );
    }
  }
}
