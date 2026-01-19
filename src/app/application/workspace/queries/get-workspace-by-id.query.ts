import { Injectable, inject } from '@angular/core';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import type { WorkspaceDto } from '../dtos/workspace.dto';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';

/**
 * GetWorkspaceByIdQuery - Query handler to get a workspace by ID
 */
@Injectable({ providedIn: 'root' })
export class GetWorkspaceByIdQuery {
  private readonly repository = inject<WorkspaceRepository>(
    'WorkspaceRepository' as any
  );

  async execute(workspaceId: string): Promise<WorkspaceDto | null> {
    try {
      const idResult = WorkspaceId.fromString(workspaceId);
      if (!idResult.isOk) {
        return null;
      }

      const workspace = await this.repository.findById?.(idResult.value);
      if (!workspace) {
        return null;
      }

      return {
        id: workspace.id.getValue(),
        name: workspace.name.getValue(),
        ownerType: workspace.owner.ownerType,
        ownerId: workspace.owner.ownerId,
        status: workspace.status.getValue(),
        createdAt: workspace.createdAt.toISOString(),
        moduleIds: [...workspace.moduleIds],
      };
    } catch (error) {
      console.error('Error in GetWorkspaceByIdQuery:', error);
      return null;
    }
  }
}
