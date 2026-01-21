import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import { MembershipRole } from '@domain/membership/enums/membership-role.enum';
import { MembershipStatus } from '@domain/membership/enums/membership-status.enum';
import { OrganizationMembership } from '@domain/membership/entities/organization-membership.entity';
import { Partner } from '@domain/membership/entities/partner.entity';
import { Team } from '@domain/membership/entities/team.entity';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class MembershipFirestoreRepository implements MembershipRepository {
  private readonly firestore = inject(Firestore);

  async getTeams(organizationId: OrganizationId): Promise<Team[]> {
    const teamsRef = collection(this.firestore, Collections.teams);
    const teamsQuery = query(
      teamsRef,
      where('organizationId', '==', organizationId.getValue()),
    );
    const snapshot = await getDocs(teamsQuery);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return Team.create({
        id: MembershipId.create(docSnapshot.id),
        organizationId: OrganizationId.create(asString(data['organizationId'])),
        memberIds: asStringArray(data['memberIds']).map((id) => UserId.create(id)),
      });
    });
  }

  async getPartners(organizationId: OrganizationId): Promise<Partner[]> {
    const partnersRef = collection(this.firestore, Collections.partners);
    const partnersQuery = query(
      partnersRef,
      where('organizationId', '==', organizationId.getValue()),
    );
    const snapshot = await getDocs(partnersQuery);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return Partner.create({
        id: MembershipId.create(docSnapshot.id),
        organizationId: OrganizationId.create(asString(data['organizationId'])),
        memberIds: asStringArray(data['memberIds']).map((id) => UserId.create(id)),
      });
    });
  }

  async getOrganizationMemberships(
    organizationId: OrganizationId,
  ): Promise<OrganizationMembership[]> {
    const membershipsRef = collection(
      this.firestore,
      Collections.organizationMemberships,
    );
    const membershipQuery = query(
      membershipsRef,
      where('organizationId', '==', organizationId.getValue()),
    );
    const snapshot = await getDocs(membershipQuery);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      const role = asString(data['role']);
      const status = asString(data['status']);
      return OrganizationMembership.create({
        id: MembershipId.create(docSnapshot.id),
        organizationId: OrganizationId.create(asString(data['organizationId'])),
        userId: UserId.create(asString(data['userId'])),
        role: Object.values(MembershipRole).includes(role as MembershipRole)
          ? (role as MembershipRole)
          : MembershipRole.Member,
        status: Object.values(MembershipStatus).includes(status as MembershipStatus)
          ? (status as MembershipStatus)
          : MembershipStatus.Active,
      });
    });
  }
}
