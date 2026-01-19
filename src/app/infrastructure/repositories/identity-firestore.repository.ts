import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { IdentityStatus } from '@domain/identity/value-objects/identity-status.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
import { Bot } from '@domain/identity/entities/bot.entity';
import { Organization } from '@domain/identity/entities/organization.entity';
import { User } from '@domain/identity/entities/user.entity';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class IdentityFirestoreRepository implements IdentityRepository {
  private readonly firestore = inject(Firestore);

  async getUsers(): Promise<User[]> {
    const usersRef = collection(this.firestore, Collections.users);
    const docs = await firstValueFrom(
      collectionData(usersRef, { idField: 'id' }).pipe(
        map((docs) =>
          docs.map((doc) => {
            const idResult = IdentityId.create(asString(doc['id']));
            const emailResult = Email.create(asString(doc['email']));
            const displayNameResult = DisplayName.create(asString(doc['displayName']));
            const statusResult = IdentityStatus.create(asString(doc['status']));
            const createdAtResult = Timestamp.fromMilliseconds(doc['createdAt'] as number);
            
            if (idResult.isFailure()) throw new Error(idResult.getError().message);
            if (emailResult.isFailure()) throw new Error(emailResult.getError().message);
            if (displayNameResult.isFailure()) throw new Error(displayNameResult.getError().message);
            if (statusResult.isFailure()) throw new Error(statusResult.getError().message);
            if (createdAtResult.isFailure()) throw new Error(createdAtResult.getError().message);
            
            return User.create({
              id: idResult.getValue(),
              email: emailResult.getValue(),
              displayName: displayNameResult.getValue(),
              status: statusResult.getValue(),
              createdAt: createdAtResult.getValue(),
            });
          })
        )
      )
    );
    return docs;
  }

  async getOrganizations(): Promise<Organization[]> {
    const organizationsRef = collection(this.firestore, Collections.organizations);
    const docs = await firstValueFrom(
      collectionData(organizationsRef, { idField: 'id' }).pipe(
        map((docs) =>
          docs.map((doc) => {
            const idResult = IdentityId.create(asString(doc['id']));
            const ownerIdResult = IdentityId.create(asString(doc['ownerId']));
            const nameResult = DisplayName.create(asString(doc['name']));
            
            if (idResult.isFailure()) throw new Error(idResult.getError().message);
            if (ownerIdResult.isFailure()) throw new Error(ownerIdResult.getError().message);
            if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
            
            return Organization.create({
              id: idResult.getValue(),
              ownerId: ownerIdResult.getValue(),
              name: nameResult.getValue(),
              memberIds: asStringArray(doc['memberIds']),
              teamIds: asStringArray(doc['teamIds']),
              partnerIds: asStringArray(doc['partnerIds']),
            });
          })
        )
      )
    );
    return docs;
  }

  async getBots(): Promise<Bot[]> {
    const botsRef = collection(this.firestore, Collections.bots);
    const docs = await firstValueFrom(
      collectionData(botsRef, { idField: 'id' }).pipe(
        map((docs) =>
          docs.map((doc) => {
            const idResult = IdentityId.create(asString(doc['id']));
            const nameResult = DisplayName.create(asString(doc['name']));
            
            if (idResult.isFailure()) throw new Error(idResult.getError().message);
            if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
            
            return {
              id: idResult.getValue(),
              name: nameResult.getValue(),
              apiKey: asString(doc['apiKey']),
              permissions: asStringArray(doc['permissions']),
            };
          })
        ),
        map((bots) => bots.map((bot) => Bot.create(bot)))
      )
    );
    return docs;
  }

  async findUserById(id: IdentityId): Promise<User | null> {
    const userDoc = doc(this.firestore, Collections.users, id.getValue());
    const userData = await firstValueFrom(
      docData(userDoc, { idField: 'id' }).pipe(
        map((doc: any) => {
          if (!doc) return null;
          const idResult = IdentityId.create(asString(doc['id']));
          const emailResult = Email.create(asString(doc['email']));
          const displayNameResult = DisplayName.create(asString(doc['displayName']));
          const statusResult = IdentityStatus.create(asString(doc['status']));
          const createdAtResult = Timestamp.fromMilliseconds(doc['createdAt'] as number);
          
          if (idResult.isFailure()) throw new Error(idResult.getError().message);
          if (emailResult.isFailure()) throw new Error(emailResult.getError().message);
          if (displayNameResult.isFailure()) throw new Error(displayNameResult.getError().message);
          if (statusResult.isFailure()) throw new Error(statusResult.getError().message);
          if (createdAtResult.isFailure()) throw new Error(createdAtResult.getError().message);
          
          return User.create({
            id: idResult.getValue(),
            email: emailResult.getValue(),
            displayName: displayNameResult.getValue(),
            status: statusResult.getValue(),
            createdAt: createdAtResult.getValue(),
          });
        })
      )
    );
    return userData ?? null;
  }

  async findUserByEmail(email: Email): Promise<User | null> {
    const usersRef = collection(this.firestore, Collections.users);
    const q = query(usersRef, where('email', '==', email.getValue()));
    const docs: any[] = await firstValueFrom(collectionData(q, { idField: 'id' }));
    if (docs.length === 0) return null;
    
    const doc = docs[0];
    const idResult = IdentityId.create(asString(doc['id']));
    const emailResult = Email.create(asString(doc['email']));
    const displayNameResult = DisplayName.create(asString(doc['displayName']));
    const statusResult = IdentityStatus.create(asString(doc['status']));
    const createdAtResult = Timestamp.fromMilliseconds(doc['createdAt'] as number);
    
    if (idResult.isFailure()) throw new Error(idResult.getError().message);
    if (emailResult.isFailure()) throw new Error(emailResult.getError().message);
    if (displayNameResult.isFailure()) throw new Error(displayNameResult.getError().message);
    if (statusResult.isFailure()) throw new Error(statusResult.getError().message);
    if (createdAtResult.isFailure()) throw new Error(createdAtResult.getError().message);
    
    return User.create({
      id: idResult.getValue(),
      email: emailResult.getValue(),
      displayName: displayNameResult.getValue(),
      status: statusResult.getValue(),
      createdAt: createdAtResult.getValue(),
    });
  }

  async findAllUsers(): Promise<User[]> {
    return this.getUsers();
  }

  async findUsersByOrganizationId(organizationId: IdentityId): Promise<User[]> {
    // Query organization-memberships to find user IDs in this organization
    const membershipsRef = collection(this.firestore, Collections.organizationMemberships);
    const q = query(membershipsRef, where('organizationId', '==', organizationId.getValue()));
    const membershipDocs = await firstValueFrom(collectionData(q, { idField: 'id' }));
    
    // Extract user IDs from memberships
    const userIds = membershipDocs.map(doc => asString(doc['userId']));
    
    if (userIds.length === 0) return [];
    
    // Fetch user documents for these IDs
    const usersRef = collection(this.firestore, Collections.users);
    const usersQuery = query(usersRef, where('id', 'in', userIds));
    const userDocs = await firstValueFrom(collectionData(usersQuery, { idField: 'id' }));
    
    return userDocs.map((doc) => {
      const idResult = IdentityId.create(asString(doc['id']));
      const emailResult = Email.create(asString(doc['email']));
      const displayNameResult = DisplayName.create(asString(doc['displayName']));
      const statusResult = IdentityStatus.create(asString(doc['status']));
      const createdAtResult = Timestamp.fromMilliseconds(doc['createdAt'] as number);
      
      if (idResult.isFailure()) throw new Error(idResult.getError().message);
      if (emailResult.isFailure()) throw new Error(emailResult.getError().message);
      if (displayNameResult.isFailure()) throw new Error(displayNameResult.getError().message);
      if (statusResult.isFailure()) throw new Error(statusResult.getError().message);
      if (createdAtResult.isFailure()) throw new Error(createdAtResult.getError().message);
      
      return User.create({
        id: idResult.getValue(),
        email: emailResult.getValue(),
        displayName: displayNameResult.getValue(),
        status: statusResult.getValue(),
        createdAt: createdAtResult.getValue(),
      });
    });
  }

  async saveUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, Collections.users, user.id.getValue());
    await setDoc(userDoc, {
      id: user.id.getValue(),
      email: user.email.getValue(),
      displayName: user.displayName.getValue(),
      status: user.status.getValue(),
      createdAt: user.createdAt.toMilliseconds(),
    });
  }

  async findOrganizationById(id: IdentityId): Promise<Organization | null> {
    const orgDoc = doc(this.firestore, Collections.organizations, id.getValue());
    const orgData = await firstValueFrom(
      docData(orgDoc, { idField: 'id' }).pipe(
        map((doc: any) => {
          if (!doc) return null;
          const idResult = IdentityId.create(asString(doc['id']));
          const ownerIdResult = IdentityId.create(asString(doc['ownerId']));
          const nameResult = DisplayName.create(asString(doc['name']));
          
          if (idResult.isFailure()) throw new Error(idResult.getError().message);
          if (ownerIdResult.isFailure()) throw new Error(ownerIdResult.getError().message);
          if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
          
          return Organization.create({
            id: idResult.getValue(),
            ownerId: ownerIdResult.getValue(),
            name: nameResult.getValue(),
            memberIds: asStringArray(doc['memberIds']),
            teamIds: asStringArray(doc['teamIds']),
            partnerIds: asStringArray(doc['partnerIds']),
          });
        })
      )
    );
    return orgData ?? null;
  }

  async findAllOrganizations(): Promise<Organization[]> {
    return this.getOrganizations();
  }

  async findOrganizationsByUserId(userId: IdentityId): Promise<Organization[]> {
    // Query organization-memberships to find organizations this user belongs to
    const membershipsRef = collection(this.firestore, Collections.organizationMemberships);
    const q = query(membershipsRef, where('userId', '==', userId.getValue()));
    const membershipDocs = await firstValueFrom(collectionData(q, { idField: 'id' }));
    
    // Extract organization IDs from memberships
    const orgIds = membershipDocs.map(doc => asString(doc['organizationId']));
    
    if (orgIds.length === 0) return [];
    
    // Fetch organization documents for these IDs
    const orgsRef = collection(this.firestore, Collections.organizations);
    const orgsQuery = query(orgsRef, where('id', 'in', orgIds));
    const orgDocs = await firstValueFrom(collectionData(orgsQuery, { idField: 'id' }));
    
    return orgDocs.map((doc) => {
      const idResult = IdentityId.create(asString(doc['id']));
      const ownerIdResult = IdentityId.create(asString(doc['ownerId']));
      const nameResult = DisplayName.create(asString(doc['name']));
      
      if (idResult.isFailure()) throw new Error(idResult.getError().message);
      if (ownerIdResult.isFailure()) throw new Error(ownerIdResult.getError().message);
      if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
      
      return Organization.create({
        id: idResult.getValue(),
        ownerId: ownerIdResult.getValue(),
        name: nameResult.getValue(),
        memberIds: asStringArray(doc['memberIds']),
        teamIds: asStringArray(doc['teamIds']),
        partnerIds: asStringArray(doc['partnerIds']),
      });
    });
  }

  async saveOrganization(org: Organization): Promise<void> {
    const orgDoc = doc(this.firestore, Collections.organizations, org.id.getValue());
    await setDoc(orgDoc, {
      id: org.id.getValue(),
      ownerId: org.ownerId.getValue(),
      name: org.name.getValue(),
      memberIds: org.memberIds,
      teamIds: org.teamIds,
      partnerIds: org.partnerIds,
    });
  }

  async findBotById(id: IdentityId): Promise<Bot | null> {
    const botDoc = doc(this.firestore, Collections.bots, id.getValue());
    const botData = await firstValueFrom(
      docData(botDoc, { idField: 'id' }).pipe(
        map((doc: any) => {
          if (!doc) return null;
          const idResult = IdentityId.create(asString(doc['id']));
          const nameResult = DisplayName.create(asString(doc['name']));
          
          if (idResult.isFailure()) throw new Error(idResult.getError().message);
          if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
          
          return Bot.create({
            id: idResult.getValue(),
            name: nameResult.getValue(),
            apiKey: asString(doc['apiKey']),
            permissions: asStringArray(doc['permissions']),
          });
        })
      )
    );
    return botData ?? null;
  }

  async findAllBots(): Promise<Bot[]> {
    return this.getBots();
  }

  async saveBot(bot: Bot): Promise<void> {
    const botDoc = doc(this.firestore, Collections.bots, bot.id.getValue());
    await setDoc(botDoc, {
      id: bot.id.getValue(),
      name: bot.name.getValue(),
      apiKey: bot.apiKey,
      permissions: bot.permissions,
    });
  }
}
