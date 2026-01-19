import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { Workspace } from '../entities/workspace.entity';
import type { WorkspaceModule } from '../entities/workspace-module.entity';

/**
 * WorkspaceRepository defines the contract for workspace persistence.
 * Pure interface with Promise-based methods as per STEP 8 requirements.
 */
export interface WorkspaceRepository {
  findById(id: WorkspaceId): Promise<Workspace | null>;
  findByOwner(owner: WorkspaceOwner): Promise<Workspace[]>;
  save(workspace: Workspace): Promise<void>;
  delete(id: WorkspaceId): Promise<void>;
  findModules(workspaceId: WorkspaceId): Promise<WorkspaceModule[]>;
  saveModule(module: WorkspaceModule): Promise<void>;
}

