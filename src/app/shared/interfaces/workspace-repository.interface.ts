import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/account/entities/identity.entity';
import type { WorkspaceModule } from '@domain/modules/entities/workspace-module.entity';
import type { Workspace } from '@domain/workspace/entities/workspace.entity';

export interface WorkspaceRepository {
  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
  ): Observable<Workspace[]>;
  getWorkspaceModules(workspaceId: string): Observable<WorkspaceModule[]>;
}
