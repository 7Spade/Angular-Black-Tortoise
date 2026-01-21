import type { Workspace } from '../entities/workspace.entity';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

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
   * Get all workspaces for a given owner.
   * 
   * @param ownerType - Type of owner (user or organization)
   * @param ownerId - ID of the owner
   * @returns Promise of workspaces
   */
  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string
  ): Promise<Workspace[]>;

  /**
   * Find workspaces by owner ID (used by use cases).
   * 
   * @param ownerId - ID of the owner
   * @returns Promise of workspaces
   */
  findByOwnerId(ownerId: string): Promise<Workspace[]>;

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
  findById(workspaceId: string): Promise<Workspace | null>;

  /**
   * Delete a workspace by ID.
   * 
   * @param workspaceId - ID of the workspace to delete
   * @returns Promise resolving when delete is complete
   */
  delete(workspaceId: string): Promise<void>;
}
