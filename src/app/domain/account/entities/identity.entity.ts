// IdentityType is restricted to user, organization, and bot only.
export type IdentityType = 'user' | 'organization' | 'bot';

// WorkspaceOwnerType is restricted to user or organization for workspace ownership.
export type WorkspaceOwnerType = 'user' | 'organization';

// Base identity fields shared across identity entities.
interface IdentityBase {
  readonly id: string;
  readonly type: IdentityType;
}

// UserAccount represents a personal identity that can own workspaces.
export interface UserAccount extends IdentityBase {
  readonly type: 'user';
  readonly organizationIds: string[];
  readonly teamIds: string[];
  readonly partnerIds: string[];
  readonly workspaceIds: string[];
}

// OrganizationAccount represents an organization identity with member references.
export interface OrganizationAccount extends IdentityBase {
  readonly type: 'organization';
  readonly memberIds: string[];
  readonly teamIds: string[];
  readonly partnerIds: string[];
  readonly workspaceIds: string[];
}

// BotAccount represents a service identity without membership lists.
export interface BotAccount extends IdentityBase {
  readonly type: 'bot';
}

// IdentityAccount is a discriminated union of allowed identity entities.
export type IdentityAccount = UserAccount | OrganizationAccount | BotAccount;
