import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/types/identity.types';
import type { WorkspaceModule } from '@domain/workspace/models/workspace-module.model';
import type { Workspace } from '@domain/workspace/models/workspace.model';

export interface WorkspaceRepository {
  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
  ): Observable<Workspace[]>;
  getWorkspaceModules(workspaceId: string): Observable<WorkspaceModule[]>;
}
