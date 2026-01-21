import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceModule } from '@domain/workspace/entities/workspace-module.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { WorkspaceStatus } from '@domain/workspace/value-objects/workspace-status.value-object';
import { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';
import { ModuleKey } from '@domain/workspace/value-objects/module-key.value-object';
import { ModuleConfig } from '@domain/workspace/value-objects/module-config.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray, asNumber } from '../mappers/firestore-mappers';

@Injectable()
export class WorkspaceFirestoreRepository implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  async findById(id: WorkspaceId): Promise<Workspace | null> {
    const workspaceDoc = doc(this.firestore, Collections.workspaces, id.getValue());
    const data = await firstValueFrom(
      docData(workspaceDoc, { idField: 'id' }).pipe(
        map((doc: any) => {
          if (!doc) return null;
          return this.mapDocToWorkspace(doc);
        })
      )
    );
    return data;
  }

  async findByOwner(owner: WorkspaceOwner): Promise<Workspace[]> {
    return this.getWorkspacesByOwner(owner);
  }

  async save(workspace: Workspace): Promise<void> {
    const workspaceDoc = doc(this.firestore, Collections.workspaces, workspace.id.getValue());
    await setDoc(workspaceDoc, {
      id: workspace.id.getValue(),
      ownerType: workspace.owner.ownerType,
      ownerId: workspace.owner.ownerId,
      name: workspace.name.getValue(),
      status: workspace.status.getValue(),
      maxModules: workspace.quota.getMaxModules(),
      maxStorage: workspace.quota.getMaxStorage(),
      moduleIds: workspace.moduleIds,
      createdAt: workspace.createdAt.toISOString(),
    });
  }

  async delete(id: WorkspaceId): Promise<void> {
    const workspaceDoc = doc(this.firestore, Collections.workspaces, id.getValue());
    await deleteDoc(workspaceDoc);
  }

  async findModules(workspaceId: WorkspaceId): Promise<WorkspaceModule[]> {
    const modulesRef = collection(this.firestore, Collections.workspaceModules);
    const modulesQuery = query(
      modulesRef,
      where('workspaceId', '==', workspaceId.getValue())
    );
    
    const docs = await firstValueFrom(
      collectionData(modulesQuery, { idField: 'id' }).pipe(
        map((docs) =>
          docs.map((doc) => {
            const workspaceIdResult = WorkspaceId.create(asString(doc['workspaceId']));
            const moduleKeyResult = ModuleKey.create(asString(doc['moduleKey']));
            
            if (workspaceIdResult.isFailure()) throw new Error(workspaceIdResult.getError().message);
            if (moduleKeyResult.isFailure()) throw new Error(moduleKeyResult.getError().message);
            
            return WorkspaceModule.create({
              id: asString(doc['id']),
              workspaceId: workspaceIdResult.getValue(),
              moduleKey: moduleKeyResult.getValue(),
              config: ModuleConfig.create(),
            });
          })
        )
      )
    );
    return docs;
  }

  async saveModule(module: WorkspaceModule): Promise<void> {
    const moduleDoc = doc(this.firestore, Collections.workspaceModules, module.id);
    await setDoc(moduleDoc, {
      id: module.id,
      workspaceId: module.workspaceId.getValue(),
      moduleKey: module.moduleKey.getValue(),
      config: module.config,
    });
  }

  async getWorkspacesByOwner(owner: WorkspaceOwner): Promise<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where('ownerType', '==', owner.ownerType),
      where('ownerId', '==', owner.ownerId),
    );
    
    const docs = await firstValueFrom(
      collectionData(workspaceQuery, { idField: 'id' }).pipe(
        map((docs) =>
          docs
            .map((doc) => this.mapDocToWorkspace(doc))
            .filter((w): w is Workspace => w !== null)
        )
      )
    );
    return docs;
  }

  private mapDocToWorkspace(doc: any): Workspace | null {
    const idResult = WorkspaceId.create(asString(doc['id']));
    const ownerResult = WorkspaceOwner.create(
      asString(doc['ownerId']),
      asString(doc['ownerType']) as 'user' | 'organization'
    );
    const nameResult = DisplayName.create(asString(doc['name']));
    const statusResult = WorkspaceStatus.create(
      asString(doc['status']) as 'active' | 'archived' | 'suspended'
    );
    const quotaResult = WorkspaceQuota.create({
      maxModules: asNumber(doc['maxModules'] ?? 10),
      maxStorage: asNumber(doc['maxStorage'] ?? 1073741824), // 1GB default
    });
    const createdAtResult = Timestamp.create(
      new Date(asString(doc['createdAt']))
    );

    if (
      idResult.isFailure() ||
      ownerResult.isFailure() ||
      nameResult.isFailure() ||
      statusResult.isFailure() ||
      quotaResult.isFailure() ||
      createdAtResult.isFailure()
    ) {
      return null;
    }

    return Workspace.create({
      id: idResult.getValue(),
      owner: ownerResult.getValue(),
      name: nameResult.getValue(),
      status: statusResult.getValue(),
      quota: quotaResult.getValue(),
      moduleIds: asStringArray(doc['moduleIds']),
      createdAt: createdAtResult.getValue(),
    });
  }
}
