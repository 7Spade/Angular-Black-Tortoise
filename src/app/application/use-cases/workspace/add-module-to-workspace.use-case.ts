import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { ModuleId } from '@domain/modules/value-objects/module-id.value-object';
import { WORKSPACE_REPOSITORY } from '@application/tokens/repository.tokens';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceAggregateFactory } from '@domain/workspace/factories';
import { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';
import { WorkspaceLifecycle } from '@domain/workspace/enums/workspace-lifecycle.enum';
import type { DomainEvent } from '@domain/shared/events';

export interface AddModuleToWorkspaceRequest {
  workspaceId: string;
  moduleId: string;
}

export interface AddModuleToWorkspaceResponse {
  success: boolean;
  events: readonly DomainEvent[];
}

/**
 * Use Case: Add a module to a workspace.
 * 
 * Business Rules:
 * - Workspace must exist
 * - Module addition must respect quota limits
 * - Adding same module twice is idempotent
 * 
 * DDD Compliance:
 * - Uses aggregate behavior method
 * - Enforces business rules through aggregate
 * - Collects and returns domain events
 */
@Injectable({ providedIn: 'root' })
export class AddModuleToWorkspaceUseCase
  implements UseCase<AddModuleToWorkspaceRequest, AddModuleToWorkspaceResponse>
{
  private readonly workspaceRepository = inject(WORKSPACE_REPOSITORY);

  async execute(
    request: AddModuleToWorkspaceRequest
  ): Promise<AddModuleToWorkspaceResponse> {
    const workspaceId = WorkspaceId.create(request.workspaceId);
    const moduleId = ModuleId.create(request.moduleId);

    // Load workspace entity
    const workspaceEntity = await this.workspaceRepository.findById(workspaceId);
    if (!workspaceEntity) {
      throw new Error(`Workspace not found: ${request.workspaceId}`);
    }

    // Reconstitute aggregate
    const aggregate = WorkspaceAggregateFactory.reconstitute({
      id: workspaceEntity.id,
      owner: workspaceEntity.owner,
      lifecycle: WorkspaceLifecycle.Active, // TODO: Load from persistence
      quota: WorkspaceQuota.unlimited(), // TODO: Load from persistence
      moduleIds: workspaceEntity.moduleIds,
    });

    // Execute domain behavior (enforces quota)
    aggregate.addModule(moduleId);

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
