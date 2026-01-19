import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

/**
 * @deprecated Use domain repository interfaces instead.
 * This combines workspace and module repositories for backward compatibility.
 */

// Plain DTOs for infrastructure layer compatibility
export interface Workspace {
  readonly id: string;
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
  readonly moduleIds: string[];
}

export interface WorkspaceModule {
  readonly id: string;
  readonly workspaceId: string;
  readonly moduleKey: string;
}

export interface WorkspaceRepository {
  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
  ): Observable<Workspace[]>;
  getWorkspaceModules(workspaceId: string): Observable<WorkspaceModule[]>;
}
