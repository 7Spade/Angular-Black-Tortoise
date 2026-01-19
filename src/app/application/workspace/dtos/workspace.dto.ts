/**
 * WorkspaceDto - Data Transfer Object for Workspace
 */
export interface WorkspaceDto {
  id: string;
  name: string;
  ownerType: 'user' | 'organization';
  ownerId: string;
  status: string;
  createdAt: string;
  moduleIds: string[];
}

/**
 * WorkspaceModuleDto - Data Transfer Object for Workspace Module
 */
export interface WorkspaceModuleDto {
  id: string;
  workspaceId: string;
  moduleKey: string;
}
