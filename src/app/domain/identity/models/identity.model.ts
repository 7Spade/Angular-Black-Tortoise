import type { BotAccount } from './bot-account.model';
import type { OrganizationAccount } from './organization-account.model';
import type { Partner } from './partner.model';
import type { Team } from './team.model';
import type { UserAccount } from './user-account.model';

export type IdentityAccount =
  | UserAccount
  | OrganizationAccount
  | BotAccount
  | Team
  | Partner;

export type MembershipGroup = OrganizationAccount | Team | Partner;
