import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ModuleRepository } from '@domain/modules/repositories/module.repository.interface';
import { Module } from '@domain/modules/entities/module.entity';
import { ModuleId } from '@domain/modules/value-objects/module-id.value-object';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { Collections } from '../collections/collection-names';
import { asString } from '../mappers/firestore-mappers';

@Injectable()
export class ModuleFirestoreRepository implements ModuleRepository {
  private readonly firestore = inject(Firestore);

  async getWorkspaceModules(workspaceId: string): Promise<Module[]> {
    const modulesRef = collection(this.firestore, Collections.modules);
    const modulesQuery = query(
      modulesRef,
      where('workspaceId', '==', workspaceId),
    );
    const docs = await firstValueFrom(
      collectionData(modulesQuery, { idField: 'id' }).pipe(
        map((docs) =>
          docs.map((doc) => {
            const moduleId = ModuleId.create(asString(doc['id']));
            const wsIdResult = WorkspaceId.create(asString(doc['workspaceId']));
            
            if (wsIdResult.isFailure()) {
              throw new Error(wsIdResult.getError().message);
            }
            
            return Module.create({
              id: moduleId,
              workspaceId: wsIdResult.getValue(),
              moduleKey: asString(doc['moduleKey']),
            });
          }),
        ),
      ),
    );
    return docs;
  }
}
