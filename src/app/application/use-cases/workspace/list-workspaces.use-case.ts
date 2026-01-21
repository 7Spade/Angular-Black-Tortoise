import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import type { Workspace } from '@domain/workspace/entities/workspace.entity';
import { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { WORKSPACE_REPOSITORY } from '@application/tokens/repository.tokens';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';

export interface ListWorkspacesRequest {
  ownerId: string;
}

export interface ListWorkspacesResponse {
  workspaces: Workspace[];
}

/**
 * Use Case: List all workspaces for a given owner.
 * 
 * Business Rules:
 * - Only return workspaces owned by the specified user/organization
 * - Results should be ordered by creation date (most recent first)
 * 
 * DDD Compliance:
 * - Query-side use case (CQRS)
 * - Returns domain entities directly (acceptable for reads)
 * - Delegates to repository for data access
 */
@Injectable({ providedIn: 'root' })
export class ListWorkspacesUseCase
  implements UseCase<ListWorkspacesRequest, ListWorkspacesResponse>
{
  private readonly workspaceRepository = inject(WORKSPACE_REPOSITORY);

  async execute(
    request: ListWorkspacesRequest
  ): Promise<ListWorkspacesResponse> {
    const ownerId = UserId.create(request.ownerId);
    const workspaces = await this.workspaceRepository.findByOwner(
      WorkspaceOwner.createUserOwner(ownerId),
    );

    return {
      workspaces,
    };
  }
}
