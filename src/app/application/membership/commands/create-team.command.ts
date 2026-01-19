import { Injectable, inject } from '@angular/core';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import { Team } from '@domain/membership/entities/team.entity';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';
import { NotFoundError } from '@domain/shared/errors/not-found.error';
import { ValidationError } from '@domain/shared/errors/validation.error';

/**
 * CreateTeamCommand - Command to create a team within an organization
 */
export interface CreateTeamCommand {
  organizationId: string;
  name: string;
  memberIds?: string[];
}

/**
 * CreateTeamCommandHandler - Handler for creating a team
 */
@Injectable({ providedIn: 'root' })
export class CreateTeamCommandHandler {
  private readonly membershipRepository = inject<MembershipRepository>(
    'MembershipRepository' as any
  );
  private readonly identityRepository = inject<IdentityRepository>(
    'IdentityRepository' as any
  );

  async execute(
    command: CreateTeamCommand
  ): Promise<Result<string, DomainError>> {
    try {
      // Validate organization ID
      const orgId = IdentityId.fromString(command.organizationId);

      // Validate team name
      const nameResult = DisplayName.create(command.name);
      if (nameResult.isFailure()) {
        return Result.fail(nameResult.getError());
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

      // Validate member IDs are organization members
      const memberIds = command.memberIds ?? [];
      for (const memberId of memberIds) {
        if (!organization.memberIds.includes(memberId)) {
          return Result.fail(
            new ValidationError(
              `User ${memberId} is not a member of the organization`
            )
          );
        }
      }

      // Create team entity
      const teamId = MembershipId.create(crypto.randomUUID());

      const team = Team.create({
        id: teamId,
        organizationId: orgId,
        name: nameResult.getValue(),
        memberIds,
        createdAt: Timestamp.create(new Date()),
      });

      // Save team (implementation needed in repository)
      // await this.membershipRepository.saveTeam(team);

      return Result.ok(teamId.getValue());
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : 'Failed to create team'
        )
      );
    }
  }
}
