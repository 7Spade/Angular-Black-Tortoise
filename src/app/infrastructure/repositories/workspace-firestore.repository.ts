import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { WorkspaceName } from '@domain/workspace/value-objects/workspace-name.value-object';
import { WorkspaceStatus, type WorkspaceStatusType } from '@domain/workspace/value-objects/workspace-status.value-object';
import { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray, asNumber } from '../mappers/firestore-mappers';

@Injectable()
export class WorkspaceFirestoreRepository implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
  ): Observable<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where('ownerType', '==', ownerType),
      where('ownerId', '==', ownerId),
    );
    return collectionData(workspaceQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: WorkspaceId.create(asString(doc['id'])),
          owner: WorkspaceOwner.create(asString(doc['ownerId']), ownerType),
          name: WorkspaceName.create(asString(doc['name'] ?? 'Untitled Workspace')),
          status: WorkspaceStatus.create((asString(doc['status'] ?? 'active')) as WorkspaceStatusType),
          quota: WorkspaceQuota.create({
            maxMembers: asNumber(doc['maxMembers'] ?? 10),
            maxStorage: asNumber(doc['maxStorage'] ?? 1024),
            maxProjects: asNumber(doc['maxProjects'] ?? 10),
          }),
          moduleIds: asStringArray(doc['moduleIds']),
          createdAt: doc['createdAt']
            ? Timestamp.create(doc['createdAt'].toDate())
            : Timestamp.now(),
        })),
      ),
      map((workspaces) =>
        workspaces.map((workspace) => Workspace.create(workspace)),
      ),
    );
  }
}
