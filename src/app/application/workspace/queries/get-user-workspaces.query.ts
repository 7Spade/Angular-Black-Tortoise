import { Injectable, inject } from '@angular/core';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import type { WorkspaceDto } from '../dtos/workspace.dto';

/**
 * GetUserWorkspacesQuery - Query handler to get all workspaces accessible by a user
 */
@Injectable({ providedIn: 'root' })
export class GetUserWorkspacesQuery {
  private readonly repository = inject<WorkspaceRepository>(
    'WorkspaceRepository' as any
  );

  async execute(userId: string): Promise<WorkspaceDto[]> {
    try {
      // Get workspaces owned by user
      const ownerResult = WorkspaceOwner.create(userId, 'user');
      if (!ownerResult.isOk) {
        return [];
      }

      const workspaces = await this.repository.findByOwner?.(ownerResult.value);
      if (!workspaces) {
        return [];
      }

      return workspaces.map((workspace) => ({
        id: workspace.id.getValue(),
        name: workspace.name.getValue(),
        ownerType: workspace.owner.ownerType,
        ownerId: workspace.owner.ownerId,
        status: workspace.status.getValue(),
        createdAt: workspace.createdAt.toISOString(),
        moduleIds: [...workspace.moduleIds],
      }));
    } catch (error) {
      console.error('Error in GetUserWorkspacesQuery:', error);
      return [];
    }
  }
}
