/**
 * Application Layer ViewModels for Workspace domain
 * Maps domain entities to UI-friendly data structures
 */

export interface WorkspaceViewModel {
  id: string;
  name: string;
  ownerType: 'user' | 'organization';
  ownerId: string;
  status: 'active' | 'archived' | 'deleted';
  moduleIds: string[];
  createdAt: string;
}

export interface WorkspaceModuleViewModel {
  id: string;
  workspaceId: string;
  moduleKey: string;
  config: Record<string, unknown>;
}
