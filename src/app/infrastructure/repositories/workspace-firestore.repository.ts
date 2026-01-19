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
import type { WorkspaceOwnerType } from '@domain/identity/types/identity.types';
import type { WorkspaceModule } from '@domain/workspace/models/workspace-module.model';
import type { Workspace } from '@domain/workspace/models/workspace.model';
import type { WorkspaceRepository } from '@shared/interfaces/workspace-repository.interface';
import { Collections } from '../collections/collection-names';

const asString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

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
