import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import { WORKSPACE_REPOSITORY } from '@application/tokens/repository.tokens';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceAggregateFactory } from '@domain/workspace/factories';
import type { DomainEvent } from '@domain/shared/events';

export interface CreateWorkspaceRequest {
  ownerId: string;
  ownerType: 'user' | 'organization';
}

export interface CreateWorkspaceResponse {
  workspaceId: string;
  events: readonly DomainEvent[];
}

/**
 * Use Case: Create a new workspace for a user or organization.
 * 
 * Business Rules:
 * - Only authenticated users or organizations can create workspaces
 * - Each workspace must have a unique ID
 * - The creator becomes the owner
 * - Workspace is created in Active state with unlimited quota by default
 * 
 * DDD Compliance:
 * - Uses aggregate factory to enforce invariants
 * - Collects and returns domain events
 * - Calls repository interface (not implementation)
 * - Contains NO domain logic (just orchestration)
 */
@Injectable({ providedIn: 'root' })
export class CreateWorkspaceUseCase
  implements UseCase<CreateWorkspaceRequest, CreateWorkspaceResponse>
{
  private readonly workspaceRepository = inject(WORKSPACE_REPOSITORY);

  async execute(
    request: CreateWorkspaceRequest
  ): Promise<CreateWorkspaceResponse> {
    // Create value objects
    const ownerId =
      request.ownerType === 'user'
        ? UserId.create(request.ownerId)
        : OrganizationId.create(request.ownerId);
    const owner = WorkspaceOwner.create({
      id: ownerId,
      type: request.ownerType,
    });

    // Use factory to create aggregate (enforces invariants, emits events)
    const workspaceAggregate = WorkspaceAggregateFactory.createNew({
      owner,
      // Uses default unlimited quota
    });

    // Collect events before persistence
    const events = workspaceAggregate.getDomainEvents();

    // Extract entity for persistence
    const workspaceEntity = workspaceAggregate.toEntity();

    // Persist via repository
    await this.workspaceRepository.save(workspaceEntity);

    // Clear events after successful persistence
    workspaceAggregate.clearDomainEvents();

    return {
      workspaceId: workspaceAggregate.getId().getValue(),
      events,
    };
  }
}
