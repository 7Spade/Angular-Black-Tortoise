import { Injectable, inject } from '@angular/core';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { Partner } from '@domain/membership/entities/partner.entity';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { Email } from '@domain/identity/value-objects/email.value-object';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';
import { NotFoundError } from '@domain/shared/errors/not-found.error';

/**
 * CreatePartnerCommand - Command to create an external partner for an organization
 */
export interface CreatePartnerCommand {
  organizationId: string;
  name: string;
  contactEmail: string;
  memberIds?: string[];
}

/**
 * CreatePartnerCommandHandler - Handler for creating a partner
 */
@Injectable({ providedIn: 'root' })
export class CreatePartnerCommandHandler {
  private readonly membershipRepository = inject<MembershipRepository>(
    'MembershipRepository' as any
  );
  private readonly identityRepository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  async execute(
    command: CreatePartnerCommand
  ): Promise<Result<string, DomainError>> {
    try {
      // Validate organization ID
      const orgIdResult = IdentityId.fromString(command.organizationId);
      if (!orgIdResult.isOk) {
        return Result.fail(orgIdResult.error);
      }

      // Validate partner name
      const nameResult = DisplayName.create(command.name);
      if (!nameResult.isOk) {
        return Result.fail(nameResult.error);
      }

      // Validate contact email
      const emailResult = Email.create(command.contactEmail);
      if (!emailResult.isOk) {
        return Result.fail(emailResult.error);
      }

      // Verify organization exists
      const organization = await this.identityRepository.findOrganizationById?.(
        orgIdResult.value
      );

      if (!organization) {
        return Result.fail(
          new NotFoundError(
            `Organization with id ${command.organizationId} not found`
          )
        );
      }

      // Create partner entity
      const partnerId = MembershipId.create();

      const partner = Partner.create({
        id: partnerId,
        organizationId: orgIdResult.value,
        name: nameResult.value,
        contactEmail: emailResult.value,
        memberIds: command.memberIds ?? [],
      });

      // Save partner (implementation needed in repository)
      // await this.membershipRepository.savePartner?.(partner);

      return Result.ok(partnerId.getValue());
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : 'Failed to create partner'
        )
      );
    }
  }
}
