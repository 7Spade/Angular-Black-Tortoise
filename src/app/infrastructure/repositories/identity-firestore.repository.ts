import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import { BotId } from '@domain/identity/value-objects/bot-id.value-object';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { Bot } from '@domain/identity/entities/bot.entity';
import { Organization } from '@domain/identity/entities/organization.entity';
import { User } from '@domain/identity/entities/user.entity';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class IdentityFirestoreRepository implements IdentityRepository {
  private readonly firestore = inject(Firestore);

  async findUsers(): Promise<User[]> {
    const usersRef = collection(this.firestore, Collections.users);
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return User.create({
        id: UserId.create(asString(data['id'] ?? docSnapshot.id)),
        organizationIds: asStringArray(data['organizationIds']).map((id) =>
          OrganizationId.create(id),
        ),
        teamIds: asStringArray(data['teamIds']).map((id) =>
          MembershipId.create(id),
        ),
        partnerIds: asStringArray(data['partnerIds']).map((id) =>
          MembershipId.create(id),
        ),
        workspaceIds: asStringArray(data['workspaceIds']).map((id) =>
          WorkspaceId.create(id),
        ),
      });
    });
  }

  async findOrganizations(): Promise<Organization[]> {
    const organizationsRef = collection(this.firestore, Collections.organizations);
    const snapshot = await getDocs(organizationsRef);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return Organization.create({
        id: OrganizationId.create(asString(data['id'] ?? docSnapshot.id)),
        memberIds: asStringArray(data['memberIds']).map((id) =>
          MembershipId.create(id),
        ),
        teamIds: asStringArray(data['teamIds']).map((id) =>
          MembershipId.create(id),
        ),
        partnerIds: asStringArray(data['partnerIds']).map((id) =>
          MembershipId.create(id),
        ),
        workspaceIds: asStringArray(data['workspaceIds']).map((id) =>
          WorkspaceId.create(id),
        ),
      });
    });
  }

  async findBots(): Promise<Bot[]> {
    const botsRef = collection(this.firestore, Collections.bots);
    const snapshot = await getDocs(botsRef);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return Bot.create({
        id: BotId.create(asString(data['id'] ?? docSnapshot.id)),
      });
    });
  }

  async findUserById(userId: UserId): Promise<User | null> {
    const userRef = doc(this.firestore, Collections.users, userId.getValue());
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.data();
    return User.create({
      id: UserId.create(snapshot.id),
      organizationIds: asStringArray(data['organizationIds']).map((id) =>
        OrganizationId.create(id),
      ),
      teamIds: asStringArray(data['teamIds']).map((id) => MembershipId.create(id)),
      partnerIds: asStringArray(data['partnerIds']).map((id) =>
        MembershipId.create(id),
      ),
      workspaceIds: asStringArray(data['workspaceIds']).map((id) =>
        WorkspaceId.create(id),
      ),
    });
  }

  async findOrganizationById(organizationId: OrganizationId): Promise<Organization | null> {
    const organizationRef = doc(
      this.firestore,
      Collections.organizations,
      organizationId.getValue(),
    );
    const snapshot = await getDoc(organizationRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.data();
    return Organization.create({
      id: OrganizationId.create(snapshot.id),
      memberIds: asStringArray(data['memberIds']).map((id) =>
        MembershipId.create(id),
      ),
      teamIds: asStringArray(data['teamIds']).map((id) => MembershipId.create(id)),
      partnerIds: asStringArray(data['partnerIds']).map((id) =>
        MembershipId.create(id),
      ),
      workspaceIds: asStringArray(data['workspaceIds']).map((id) =>
        WorkspaceId.create(id),
      ),
    });
  }

  async findBotById(botId: BotId): Promise<Bot | null> {
    const botRef = doc(this.firestore, Collections.bots, botId.getValue());
    const snapshot = await getDoc(botRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.data();
    return Bot.create({
      id: BotId.create(asString(data['id'] ?? snapshot.id)),
    });
  }

  async saveUser(user: User): Promise<void> {
    const userRef = doc(this.firestore, Collections.users, user.id.getValue());
    await setDoc(
      userRef,
      {
        id: user.id.getValue(),
        organizationIds: user.organizationIds.map((id) => id.getValue()),
        teamIds: user.teamIds.map((id) => id.getValue()),
        partnerIds: user.partnerIds.map((id) => id.getValue()),
        workspaceIds: user.workspaceIds.map((id) => id.getValue()),
      },
      { merge: true },
    );
  }

  async saveOrganization(organization: Organization): Promise<void> {
    const organizationRef = doc(
      this.firestore,
      Collections.organizations,
      organization.id.getValue(),
    );
    await setDoc(
      organizationRef,
      {
        id: organization.id.getValue(),
        memberIds: organization.memberIds.map((id) => id.getValue()),
        teamIds: organization.teamIds.map((id) => id.getValue()),
        partnerIds: organization.partnerIds.map((id) => id.getValue()),
        workspaceIds: organization.workspaceIds.map((id) => id.getValue()),
      },
      { merge: true },
    );
  }

  async saveBot(bot: Bot): Promise<void> {
    const botRef = doc(this.firestore, Collections.bots, bot.id.getValue());
    await setDoc(
      botRef,
      {
        id: bot.id.getValue(),
      },
      { merge: true },
    );
  }

  async deleteUser(userId: UserId): Promise<void> {
    const userRef = doc(this.firestore, Collections.users, userId.getValue());
    await deleteDoc(userRef);
  }

  async deleteOrganization(organizationId: OrganizationId): Promise<void> {
    const organizationRef = doc(
      this.firestore,
      Collections.organizations,
      organizationId.getValue(),
    );
    await deleteDoc(organizationRef);
  }

  async deleteBot(botId: BotId): Promise<void> {
    const botRef = doc(this.firestore, Collections.bots, botId.getValue());
    await deleteDoc(botRef);
  }
}
