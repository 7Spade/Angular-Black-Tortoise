import type { WorkspaceModule } from '../entities/workspace-module.entity';

/**
 * ModuleRepository defines the contract for module persistence.
 * Returns Promises for framework-agnostic async operations (DDD requirement).
 */
export interface ModuleRepository {
  getWorkspaceModules(workspaceId: string): Promise<WorkspaceModule[]>;
}
