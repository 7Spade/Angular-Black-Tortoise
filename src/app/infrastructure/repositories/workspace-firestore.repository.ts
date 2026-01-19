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
import type { WorkspaceRepository } from '@shared/interfaces/workspace-repository.interface';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../utils/firestore-mappers';

// DTOs for infrastructure layer
interface Workspace {
  readonly id: string;
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
  readonly moduleIds: string[];
}

interface WorkspaceModule {
  readonly id: string;
  readonly workspaceId: string;
  readonly moduleKey: string;
}

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
          id: asString(doc['id']),
          ownerId: asString(doc['ownerId']),
          ownerType,
          moduleIds: asStringArray(doc['moduleIds']),
        })),
      ),
    );
  }

  getWorkspaceModules(workspaceId: string): Observable<WorkspaceModule[]> {
    const modulesRef = collection(this.firestore, Collections.modules);
    const modulesQuery = query(
      modulesRef,
      where('workspaceId', '==', workspaceId),
    );
    return collectionData(modulesQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: asString(doc['id']),
          workspaceId: asString(doc['workspaceId']),
          moduleKey: asString(doc['moduleKey']),
        })),
      ),
    );
  }
}
