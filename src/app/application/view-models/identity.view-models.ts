/**
 * Application Layer ViewModels for Identity domain
 * Maps domain entities to UI-friendly data structures
 */

export interface UserViewModel {
  id: string;
  displayName: string | null;
  email: string;
  type: 'user';
  organizationIds: readonly string[];
  teamIds: readonly string[];
  partnerIds: readonly string[];
  workspaceIds: readonly string[];
}

export interface OrganizationViewModel {
  id: string;
  name: string;
  ownerId: string;
  type: 'organization';
  memberIds: readonly string[];
  teamIds: readonly string[];
  partnerIds: readonly string[];
}

export interface TeamViewModel {
  id: string;
  name: string;
  organizationId: string;
  type: 'team';
  memberIds: readonly string[];
}

export interface PartnerViewModel {
  id: string;
  name: string;
  organizationId: string;
  type: 'partner';
  memberIds: readonly string[];
}

export type IdentityViewModel = UserViewModel | OrganizationViewModel | TeamViewModel | PartnerViewModel;
