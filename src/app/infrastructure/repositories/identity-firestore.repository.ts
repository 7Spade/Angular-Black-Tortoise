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
import type { BotAccount } from '@domain/identity/models/bot-account.model';
import type { OrganizationAccount } from '@domain/identity/models/organization-account.model';
import type { Partner } from '@domain/identity/models/partner.model';
import type { Team } from '@domain/identity/models/team.model';
import type { UserAccount } from '@domain/identity/models/user-account.model';
import type { IdentityRepository } from '@shared/interfaces/identity-repository.interface';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../utils/firestore-mappers';

@Injectable()
export class IdentityFirestoreRepository implements IdentityRepository {
  private readonly firestore = inject(Firestore);

  getUsers(): Observable<UserAccount[]> {
    const usersRef = collection(this.firestore, Collections.users);
    return collectionData(usersRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: asString(doc['id']),
          type: 'user' as const,
          workspaceIds: asStringArray(doc['workspaceIds']),
        })),
      ),
    );
  }

  getOrganizations(): Observable<OrganizationAccount[]> {
    const organizationsRef = collection(this.firestore, Collections.organizations);
    return collectionData(organizationsRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: asString(doc['id']),
          type: 'organization' as const,
          memberIds: asStringArray(doc['memberIds']),
          workspaceIds: asStringArray(doc['workspaceIds']),
        })),
      ),
    );
  }

  getBots(): Observable<BotAccount[]> {
    const botsRef = collection(this.firestore, Collections.bots);
    return collectionData(botsRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: asString(doc['id']),
          type: 'bot' as const,
        })),
      ),
    );
  }

  getTeams(organizationId: string): Observable<Team[]> {
    const teamsRef = collection(this.firestore, Collections.teams);
    const teamsQuery = query(
      teamsRef,
      where('organizationId', '==', organizationId),
    );
    return collectionData(teamsQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: asString(doc['id']),
          type: 'team' as const,
          organizationId: asString(doc['organizationId']),
          memberIds: asStringArray(doc['memberIds']),
        })),
      ),
    );
  }

  getPartners(organizationId: string): Observable<Partner[]> {
    const partnersRef = collection(this.firestore, Collections.partners);
    const partnersQuery = query(
      partnersRef,
      where('organizationId', '==', organizationId),
    );
    return collectionData(partnersQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: asString(doc['id']),
          type: 'partner' as const,
          organizationId: asString(doc['organizationId']),
          memberIds: asStringArray(doc['memberIds']),
        })),
      ),
    );
  }
}
