import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
} from '@angular/fire/firestore';
import { map, firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

/**
 * WorkspaceFirestoreRepository - Infrastructure implementation
 * 
 * DDD Compliance:
 * - Implements domain repository interface
 * - Converts between Firestore DTOs and domain entities
 * - Handles all persistence concerns
 * - No domain logic (only data access)
 */
@Injectable()
export class WorkspaceFirestoreRepository implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string
  ): Observable<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where('ownerType', '==', ownerType),
      where('ownerId', '==', ownerId)
    );
    return collectionData(workspaceQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) =>
          Workspace.create({
            id: WorkspaceId.create(asString(doc['id'])),
            owner: WorkspaceOwner.create({
              id: asString(doc['ownerId']),
              type: ownerType,
            }),
            moduleIds: asStringArray(doc['moduleIds']),
          })
        )
      )
    );
  }

  async findByOwnerId(ownerId: string): Promise<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where('ownerId', '==', ownerId)
    );
    
    const snapshot = await getDocs(workspaceQuery);
    
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return Workspace.create({
        id: WorkspaceId.create(docSnapshot.id),
        owner: WorkspaceOwner.create({
          id: asString(data['ownerId']),
          type: asString(data['ownerType']) as WorkspaceOwnerType,
        }),
        moduleIds: asStringArray(data['moduleIds']),
      });
    });
  }

  async save(workspace: Workspace): Promise<void> {
    const workspaceRef = doc(
      this.firestore,
      Collections.workspaces,
      workspace.id.getValue()
    );

    const data = {
      ownerId: workspace.owner.id,
      ownerType: workspace.owner.type,
      moduleIds: Array.from(workspace.moduleIds),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(workspaceRef, data, { merge: true });
  }

  async findById(workspaceId: string): Promise<Workspace | null> {
    const workspaceRef = doc(
      this.firestore,
      Collections.workspaces,
      workspaceId
    );

    const snapshot = await getDoc(workspaceRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return Workspace.create({
      id: WorkspaceId.create(snapshot.id),
      owner: WorkspaceOwner.create({
        id: asString(data['ownerId']),
        type: asString(data['ownerType']) as WorkspaceOwnerType,
      }),
      moduleIds: asStringArray(data['moduleIds']),
    });
  }

  async delete(workspaceId: string): Promise<void> {
    const workspaceRef = doc(
      this.firestore,
      Collections.workspaces,
      workspaceId
    );

    await deleteDoc(workspaceRef);
  }
}
