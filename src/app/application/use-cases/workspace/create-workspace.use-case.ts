import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { WORKSPACE_REPOSITORY } from '@application/tokens/repository.tokens';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';

export interface CreateWorkspaceRequest {
  ownerId: string;
  ownerType: 'user' | 'organization';
}

export interface CreateWorkspaceResponse {
  workspaceId: string;
}

/**
 * Use Case: Create a new workspace for a user or organization.
 * 
 * Business Rules:
 * - Only authenticated users or organizations can create workspaces
 * - Each workspace must have a unique ID
 * - The creator becomes the owner
 * 
 * DDD Compliance:
 * - Uses domain entities (Workspace)
 * - Uses value objects (WorkspaceId, WorkspaceOwner)
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
    const workspaceId = WorkspaceId.generate();
    const owner = WorkspaceOwner.create({
      id: request.ownerId,
      type: request.ownerType,
    });

    // Create domain entity
    const workspace = Workspace.create({
      id: workspaceId,
      owner,
      moduleIds: [],
    });

    // Persist via repository
    await this.workspaceRepository.save(workspace);

    return {
      workspaceId: workspaceId.getValue(),
    };
  }
}
