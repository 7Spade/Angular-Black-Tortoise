import type { Workspace } from '../entities/workspace.entity';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { WorkspaceId } from '../value-objects/workspace-id.value-object';

/**
 * WorkspaceRepository defines the contract for workspace persistence.
 * 
 * DDD Compliance:
 * - Repository interfaces belong to Domain layer
 * - Implementations belong to Infrastructure layer
 * - Methods return domain entities, not DTOs
 * - All methods return Promises for non-reactive domain layer
 */
export interface WorkspaceRepository {
  /**
   * Find workspaces by owner.
   *
   * @param owner - Workspace owner value object
   * @returns Promise of workspaces
   */
  findByOwner(owner: WorkspaceOwner): Promise<Workspace[]>;

  /**
   * Save a workspace (create or update).
   * 
   * @param workspace - Workspace entity to save
   * @returns Promise resolving when save is complete
   */
  save(workspace: Workspace): Promise<void>;

  /**
   * Find a workspace by ID.
   * 
   * @param workspaceId - ID of the workspace
   * @returns Promise of workspace or null if not found
   */
  findById(workspaceId: WorkspaceId): Promise<Workspace | null>;

  /**
   * Delete a workspace by ID.
   * 
   * @param workspaceId - ID of the workspace to delete
   * @returns Promise resolving when delete is complete
   */
  delete(workspaceId: WorkspaceId): Promise<void>;
}
