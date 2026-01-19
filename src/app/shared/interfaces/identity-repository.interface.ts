import type { Observable } from 'rxjs';

/**
 * @deprecated Use domain repository interfaces instead.
 * This file is kept for backward compatibility only with plain DTOs.
 */

// Plain DTOs for infrastructure layer compatibility
export interface UserAccount {
  readonly id: string;
  readonly type: 'user';
  readonly organizationIds: string[];
  readonly teamIds: string[];
  readonly partnerIds: string[];
  readonly workspaceIds: string[];
}

export interface OrganizationAccount {
  readonly id: string;
  readonly type: 'organization';
  readonly memberIds: string[];
  readonly teamIds: string[];
  readonly partnerIds: string[];
  readonly workspaceIds: string[];
}

export interface BotAccount {
  readonly id: string;
  readonly type: 'bot';
}

export interface Team {
  readonly id: string;
  readonly type: 'team';
  readonly organizationId: string;
  readonly memberIds: string[];
}

export interface Partner {
  readonly id: string;
  readonly type: 'partner';
  readonly organizationId: string;
  readonly memberIds: string[];
}

export interface IdentityRepository {
  getUsers(): Observable<UserAccount[]>;
  getOrganizations(): Observable<OrganizationAccount[]>;
  getBots(): Observable<BotAccount[]>;
  getTeams(organizationId: string): Observable<Team[]>;
  getPartners(organizationId: string): Observable<Partner[]>;
}
