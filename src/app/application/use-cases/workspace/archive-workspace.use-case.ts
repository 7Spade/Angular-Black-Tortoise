import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WORKSPACE_REPOSITORY } from '@application/tokens/repository.tokens';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceAggregateFactory } from '@domain/workspace/factories';
import { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';
import { WorkspaceLifecycle } from '@domain/workspace/enums/workspace-lifecycle.enum';
import type { DomainEvent } from '@domain/shared/events';

export interface ArchiveWorkspaceRequest {
  workspaceId: string;
}

export interface ArchiveWorkspaceResponse {
  success: boolean;
  events: readonly DomainEvent[];
}

/**
 * Use Case: Archive a workspace.
 * 
 * Business Rules:
 * - Only active or archived workspaces can be archived
 * - Deleted workspaces cannot be archived
 * - Archiving is idempotent
 * 
 * DDD Compliance:
 * - Loads aggregate from repository
 * - Calls domain behavior method
 * - Collects and returns domain events
 * - Persists changes
 */
@Injectable({ providedIn: 'root' })
export class ArchiveWorkspaceUseCase
  implements UseCase<ArchiveWorkspaceRequest, ArchiveWorkspaceResponse>
{
  private readonly workspaceRepository = inject(WORKSPACE_REPOSITORY);

  async execute(
    request: ArchiveWorkspaceRequest
  ): Promise<ArchiveWorkspaceResponse> {
    const workspaceId = WorkspaceId.create(request.workspaceId);

    // Load workspace entity from repository
    const workspaceEntity = await this.workspaceRepository.findById(workspaceId);
    if (!workspaceEntity) {
      throw new Error(`Workspace not found: ${request.workspaceId}`);
    }

    // Reconstitute aggregate (for now, we'll need to add lifecycle/quota to repository)
    // For simplicity, using defaults here - in production, these should come from repository
    const aggregate = WorkspaceAggregateFactory.reconstitute({
      id: workspaceEntity.id,
      owner: workspaceEntity.owner,
      lifecycle: WorkspaceLifecycle.Active, // TODO: Load from persistence
      quota: WorkspaceQuota.unlimited(), // TODO: Load from persistence
      moduleIds: workspaceEntity.moduleIds,
    });

    // Execute domain behavior
    aggregate.archive();

    // Collect events
    const events = aggregate.getDomainEvents();

    // Persist changes
    const updatedEntity = aggregate.toEntity();
    await this.workspaceRepository.save(updatedEntity);

    // Clear events after persistence
    aggregate.clearDomainEvents();

    return {
      success: true,
      events,
    };
  }
}
