import type { Observable } from 'rxjs';
import type { BotAccount } from '@domain/identity/models/bot-account.model';
import type { OrganizationAccount } from '@domain/identity/models/organization-account.model';
import type { Partner } from '@domain/identity/models/partner.model';
import type { Team } from '@domain/identity/models/team.model';
import type { UserAccount } from '@domain/identity/models/user-account.model';

export interface IdentityRepository {
  getUsers(): Observable<UserAccount[]>;
  getOrganizations(): Observable<OrganizationAccount[]>;
  getBots(): Observable<BotAccount[]>;
  getTeams(organizationId: string): Observable<Team[]>;
  getPartners(organizationId: string): Observable<Partner[]>;
}
