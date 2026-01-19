import { Injectable, inject } from '@angular/core';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { Organization } from '@domain/identity/entities/organization.entity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';

/**
 * CreateOrganizationCommand - Command to create a new organization
 */
export interface CreateOrganizationCommand {
  ownerId: string;
  name: string;
}

/**
 * CreateOrganizationCommandHandler - Handler for creating a new organization
 */
@Injectable({ providedIn: 'root' })
export class CreateOrganizationCommandHandler {
  private readonly repository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  async execute(
    command: CreateOrganizationCommand
  ): Promise<Result<string, DomainError>> {
    try {
      // Validate owner ID
      const ownerIdResult = IdentityId.fromString(command.ownerId);
      if (!ownerIdResult.isOk) {
        return Result.fail(ownerIdResult.error);
      }

      // Validate organization name
      const nameResult = DisplayName.create(command.name);
      if (nameResult.isFailure()) {
        return Result.fail(nameResult.getError());
      }

      // Create organization entity
      const orgIdResult = IdentityId.create(crypto.randomUUID());
      if (!orgIdResult.isOk) {
        return Result.fail(orgIdResult.error);
      }

      const organization = Organization.create({
        id: orgIdResult.value,
        ownerId: ownerIdResult.value,
        name: nameResult.getValue(),
        memberIds: [ownerIdResult.value.getValue()], // Owner is automatically a member
        teamIds: [],
        partnerIds: [],
      });

      // Save organization
      await this.repository.saveOrganization(organization);

      return Result.ok(orgIdResult.value.getValue());
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error
            ? error.message
            : 'Failed to create organization'
        )
      );
    }
  }
}
