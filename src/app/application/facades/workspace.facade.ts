import { computed, inject, Injectable } from '@angular/core';
import { WorkspaceStore } from '@application/stores/workspace.store';
import { CreateWorkspaceUseCase } from '@application/use-cases/workspace/create-workspace.use-case';
import { ListWorkspacesUseCase } from '@application/use-cases/workspace/list-workspaces.use-case';

/**
 * Workspace Facade - Unified API for workspace operations.
 * 
 * Purpose:
 * - Provides a simplified interface for UI components
 * - Coordinates between stores and use cases
 * - Handles complex workflows that span multiple use cases
 * - Exposes reactive signals for UI consumption
 * 
 * DDD Compliance:
 * - Facades belong to Application layer
 * - They delegate to use cases for commands
 * - They expose store signals for queries
 * - UI components should ONLY interact via facades (not directly with stores/use cases)
 * 
 * Signals Architecture:
 * - All state is exposed as signals (no observables leaked to UI)
 * - Supports zone-less change detection
 * - Computed signals derive additional state
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceFacade {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly createWorkspaceUseCase = inject(CreateWorkspaceUseCase);
  private readonly listWorkspacesUseCase = inject(ListWorkspacesUseCase);

  // State signals from store
  readonly workspaces = this.workspaceStore.workspaces;
  readonly loading = this.workspaceStore.loading;
  readonly error = this.workspaceStore.error;

  // Computed signals
  readonly hasWorkspaces = computed(() => this.workspaces().length > 0);

  /**
   * Create a new workspace for the current user.
   * 
   * @param ownerId - ID of the owner (user or organization)
   * @param ownerType - Type of owner
   * @returns Promise resolving to the new workspace ID
   */
  async createWorkspace(
    ownerId: string,
    ownerType: 'user' | 'organization'
  ): Promise<string> {
    try {
      const result = await this.createWorkspaceUseCase.execute({
        ownerId,
        ownerType,
      });

      // Reload workspaces to include the new one
      this.workspaceStore.setActiveOwner(ownerType, ownerId);

      return result.workspaceId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create workspace';
      throw new Error(errorMessage);
    }
  }

  /**
   * Load all workspaces for a given owner.
   * 
   * @param ownerId - ID of the owner to load workspaces for
   * @param ownerType - Type of owner
   */
  loadWorkspaces(ownerId: string, ownerType: 'user' | 'organization' = 'user'): void {
    this.workspaceStore.setActiveOwner(ownerType, ownerId);
  }

  /**
   * Clear any error state.
   */
  clearError(): void {
    // Error clearing is handled by the store internally
  }
}
