import type { WorkspaceModule } from '../entities/workspace-module.entity';

/**
 * ModuleRepository defines the contract for module persistence.
 * All methods return Promises for non-reactive domain layer.
 */
export interface ModuleRepository {
  getWorkspaceModules(workspaceId: string): Promise<WorkspaceModule[]>;
  findById(moduleId: string): Promise<WorkspaceModule | null>;
  save(module: WorkspaceModule): Promise<void>;
  delete(moduleId: string): Promise<void>;
}
