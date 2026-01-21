import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import { MembershipRole } from '@domain/membership/enums/membership-role.enum';
import { MembershipStatus } from '@domain/membership/enums/membership-status.enum';
import { OrganizationMembership } from '@domain/membership/entities/organization-membership.entity';
import { Partner } from '@domain/membership/entities/partner.entity';
import { Team } from '@domain/membership/entities/team.entity';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class MembershipFirestoreRepository implements MembershipRepository {
  private readonly firestore = inject(Firestore);

  async getTeams(organizationId: string): Promise<Team[]> {
    const teamsRef = collection(this.firestore, Collections.teams);
    const teamsQuery = query(
      teamsRef,
      where('organizationId', '==', organizationId),
    );
    const docs: any[] = await firstValueFrom(
      collectionData(teamsQuery, { idField: 'id' })
    );
    
    return docs.map((doc) => {
      const idResult = MembershipId.create(asString(doc['id']));
      const orgIdResult = IdentityId.create(asString(doc['organizationId']));
      const nameResult = DisplayName.create(asString(doc['name']));
      
      if (idResult.isFailure()) throw new Error(idResult.getError().message);
      if (orgIdResult.isFailure()) throw new Error(orgIdResult.getError().message);
      if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
      
      return Team.create({
        id: idResult.getValue(),
        organizationId: orgIdResult.getValue(),
        name: nameResult.getValue(),
        memberIds: asStringArray(doc['memberIds']),
      });
    });
  }

  async getPartners(organizationId: string): Promise<Partner[]> {
    const partnersRef = collection(this.firestore, Collections.partners);
    const partnersQuery = query(
      partnersRef,
      where('organizationId', '==', organizationId),
    );
    const docs: any[] = await firstValueFrom(
      collectionData(partnersQuery, { idField: 'id' })
    );
    
    return docs.map((doc) => {
      const idResult = MembershipId.create(asString(doc['id']));
      const orgIdResult = IdentityId.create(asString(doc['organizationId']));
      const nameResult = DisplayName.create(asString(doc['name']));
      const emailResult = Email.create(asString(doc['contactEmail']));
      
      if (idResult.isFailure()) throw new Error(idResult.getError().message);
      if (orgIdResult.isFailure()) throw new Error(orgIdResult.getError().message);
      if (nameResult.isFailure()) throw new Error(nameResult.getError().message);
      if (emailResult.isFailure()) throw new Error(emailResult.getError().message);
      
      return Partner.create({
        id: idResult.getValue(),
        organizationId: orgIdResult.getValue(),
        name: nameResult.getValue(),
        contactEmail: emailResult.getValue(),
        memberIds: asStringArray(doc['memberIds']),
      });
    });
  }

  async getOrganizationMemberships(
    organizationId: string,
  ): Promise<OrganizationMembership[]> {
    const membershipsRef = collection(
      this.firestore,
      Collections.organizationMemberships,
    );
    const membershipQuery = query(
      membershipsRef,
      where('organizationId', '==', organizationId),
    );
    const docs: any[] = await firstValueFrom(
      collectionData(membershipQuery, { idField: 'id' })
    );
    
    return docs.map((doc) => {
      const idResult = MembershipId.create(asString(doc['id']));
      if (idResult.isFailure()) throw new Error(idResult.getError().message);
      
      const role = asString(doc['role']);
      const status = asString(doc['status']);
      
      return OrganizationMembership.create({
        id: idResult.getValue(),
        organizationId: asString(doc['organizationId']),
        userId: asString(doc['userId']),
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
