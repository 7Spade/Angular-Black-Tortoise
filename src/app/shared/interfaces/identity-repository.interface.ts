import type { Observable } from 'rxjs';
import type {
  BotAccount,
  OrganizationAccount,
  UserAccount,
} from '@domain/account/entities/identity.entity';
import type { Partner, Team } from '@domain/membership/entities/membership.entity';

export interface IdentityRepository {
  getUsers(): Observable<UserAccount[]>;
  getOrganizations(): Observable<OrganizationAccount[]>;
  getBots(): Observable<BotAccount[]>;
  getTeams(organizationId: string): Observable<Team[]>;
  getPartners(organizationId: string): Observable<Partner[]>;
}
