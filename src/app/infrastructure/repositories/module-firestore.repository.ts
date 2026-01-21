import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import type { ModuleRepository } from '@domain/modules/repositories/module.repository.interface';
import { WorkspaceModule } from '@domain/modules/entities/workspace-module.entity';
import { ModuleId } from '@domain/modules/value-objects/module-id.value-object';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { Collections } from '../collections/collection-names';
import { asString } from '../mappers/firestore-mappers';

@Injectable()
export class ModuleFirestoreRepository implements ModuleRepository {
  private readonly firestore = inject(Firestore);

  async getWorkspaceModules(workspaceId: WorkspaceId): Promise<WorkspaceModule[]> {
    const modulesRef = collection(this.firestore, Collections.modules);
    const modulesQuery = query(
      modulesRef,
      where('workspaceId', '==', workspaceId.getValue()),
    );
    const snapshot = await getDocs(modulesQuery);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return WorkspaceModule.create({
        id: ModuleId.create(docSnapshot.id),
        workspaceId: WorkspaceId.create(asString(data['workspaceId'])),
        moduleKey: asString(data['moduleKey']),
      });
    });
  }

  async findById(moduleId: ModuleId): Promise<WorkspaceModule | null> {
    const moduleRef = doc(this.firestore, Collections.modules, moduleId.getValue());
    const snapshot = await getDoc(moduleRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.data();
    return WorkspaceModule.create({
      id: ModuleId.create(snapshot.id),
      workspaceId: WorkspaceId.create(asString(data['workspaceId'])),
      moduleKey: asString(data['moduleKey']),
    });
  }

  async save(module: WorkspaceModule): Promise<void> {
    const moduleRef = doc(this.firestore, Collections.modules, module.id.getValue());
    await setDoc(
      moduleRef,
      {
        id: module.id.getValue(),
        workspaceId: module.workspaceId.getValue(),
        moduleKey: module.moduleKey,
      },
      { merge: true },
    );
  }

  async delete(moduleId: ModuleId): Promise<void> {
    const moduleRef = doc(this.firestore, Collections.modules, moduleId.getValue());
    await deleteDoc(moduleRef);
  }
}
