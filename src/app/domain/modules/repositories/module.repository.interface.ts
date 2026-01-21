import type { WorkspaceModule } from '../entities/workspace-module.entity';
import type { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import type { ModuleId } from '../value-objects/module-id.value-object';

/**
 * ModuleRepository defines the contract for module persistence.
 * All methods return Promises for non-reactive domain layer.
 */
export interface ModuleRepository {
  getWorkspaceModules(workspaceId: WorkspaceId): Promise<WorkspaceModule[]>;
  findById(moduleId: ModuleId): Promise<WorkspaceModule | null>;
  save(module: WorkspaceModule): Promise<void>;
  delete(moduleId: ModuleId): Promise<void>;
}
