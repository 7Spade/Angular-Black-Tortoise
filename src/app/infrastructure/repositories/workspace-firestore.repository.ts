import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
} from '@angular/fire/firestore';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import { ModuleId } from '@domain/modules/value-objects/module-id.value-object';
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

  async findByOwner(owner: WorkspaceOwner): Promise<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where(
        'ownerId',
        '==',
        owner.isUserOwned()
          ? owner.getUserId().getValue()
          : owner.getOrganizationId().getValue(),
      ),
      where('ownerType', '==', owner.type),
    );
    const snapshot = await getDocs(workspaceQuery);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
    const ownerType = asString(data['ownerType']) as WorkspaceOwner['type'];
      const ownerId =
        ownerType === 'user'
          ? UserId.create(asString(data['ownerId']))
          : OrganizationId.create(asString(data['ownerId']));
      return Workspace.create({
        id: WorkspaceId.create(docSnapshot.id),
        owner: WorkspaceOwner.create({ id: ownerId, type: ownerType }),
        moduleIds: asStringArray(data['moduleIds']).map((id) => ModuleId.create(id)),
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
      ownerId: workspace.owner.isUserOwned()
        ? workspace.owner.getUserId().getValue()
        : workspace.owner.getOrganizationId().getValue(),
      ownerType: workspace.owner.type,
      moduleIds: workspace.moduleIds.map((moduleId) => moduleId.getValue()),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(workspaceRef, data, { merge: true });
  }

  async findById(workspaceId: WorkspaceId): Promise<Workspace | null> {
    const workspaceRef = doc(
      this.firestore,
      Collections.workspaces,
      workspaceId.getValue()
    );

    const snapshot = await getDoc(workspaceRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    const ownerType = asString(data['ownerType']) as WorkspaceOwner['type'];
    const ownerId =
      ownerType === 'user'
        ? UserId.create(asString(data['ownerId']))
        : OrganizationId.create(asString(data['ownerId']));

    return Workspace.create({
      id: WorkspaceId.create(snapshot.id),
      owner: WorkspaceOwner.create({ id: ownerId, type: ownerType }),
      moduleIds: asStringArray(data['moduleIds']).map((id) => ModuleId.create(id)),
    });
  }

  async delete(workspaceId: WorkspaceId): Promise<void> {
    const workspaceRef = doc(
      this.firestore,
      Collections.workspaces,
      workspaceId.getValue()
    );

    await deleteDoc(workspaceRef);
  }
}
