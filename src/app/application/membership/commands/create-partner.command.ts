import { Injectable, inject } from '@angular/core';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { Partner } from '@domain/membership/entities/partner.entity';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
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
      const orgId = IdentityId.fromString(command.organizationId);

      // Validate partner name
      const nameResult = DisplayName.create(command.name);
      if (nameResult.isFailure()) {
        return Result.fail(nameResult.getError());
      }

      // Validate contact email
      const emailResult = Email.create(command.contactEmail);
      if (emailResult.isFailure()) {
        return Result.fail(emailResult.getError());
      }

      // Verify organization exists
      const organization = await this.identityRepository.findOrganizationById(
        orgId
      );

      if (!organization) {
        return Result.fail(
          new NotFoundError(
            `Organization with id ${command.organizationId} not found`
          )
        );
      }

      // Create partner entity
      const partnerId = MembershipId.create(crypto.randomUUID());

      const partner = Partner.create({
        id: partnerId,
        organizationId: orgId,
        name: nameResult.getValue(),
        contactEmail: emailResult.getValue(),
        memberIds: command.memberIds ?? [],
        createdAt: Timestamp.create(new Date()),
      });

      // Save partner (implementation needed in repository)
      // await this.membershipRepository.savePartner(partner);

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
