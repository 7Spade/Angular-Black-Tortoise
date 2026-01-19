import { Injectable, inject } from '@angular/core';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import type { WorkspaceModuleDto } from '../dtos/workspace.dto';

/**
 * GetWorkspaceModulesQuery - Query handler to get all modules in a workspace
 */
@Injectable({ providedIn: 'root' })
export class GetWorkspaceModulesQuery {
  private readonly repository = inject<WorkspaceRepository>(
    'WorkspaceRepository' as any
  );

  async execute(workspaceId: string): Promise<WorkspaceModuleDto[]> {
    try {
      const idResult = WorkspaceId.fromString(workspaceId);
      if (!idResult.isOk) {
        return [];
      }

      const modules = await this.repository.findModules?.(idResult.value);
      if (!modules) {
        return [];
      }

      return modules.map((module) => ({
        id: module.id,
        workspaceId: module.workspaceId.getValue(),
        moduleKey: module.moduleKey.getValue(),
      }));
    } catch (error) {
      console.error('Error in GetWorkspaceModulesQuery:', error);
      return [];
    }
  }
}
