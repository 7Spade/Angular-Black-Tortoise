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
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceModule } from '@domain/workspace/entities/workspace-module.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { WorkspaceStatus } from '@domain/workspace/value-objects/workspace-status.value-object';
import { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray, asNumber } from '../mappers/firestore-mappers';

@Injectable()
export class WorkspaceFirestoreRepository implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  async getWorkspacesByOwner(owner: WorkspaceOwner): Promise<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where('ownerType', '==', owner.ownerType),
      where('ownerId', '==', owner.ownerId),
    );
    
    const snapshot = await firstValueFrom(
      collectionData(workspaceQuery, { idField: 'id' }).pipe(
        map((docs) =>
          docs
            .map((doc) => {
              const idResult = WorkspaceId.create(asString(doc['id']));
              const ownerResult = WorkspaceOwner.create(owner.ownerId, owner.ownerType);
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
              !idResult.isOk ||
              !ownerResult.isOk ||
              !nameResult.isOk ||
              !statusResult.isOk ||
              !quotaResult.isOk ||
              !createdAtResult.isOk
            ) {
              return null;
            }

            return Workspace.create({
              id: idResult.value,
              owner: ownerResult.value,
              name: nameResult.value,
              status: statusResult.value,
              quota: quotaResult.value,
              moduleIds: asStringArray(doc['moduleIds']),
              createdAt: createdAtResult.value,
            });
          })
          .filter((w): w is Workspace => w !== null)
      )
    );
  }
}
