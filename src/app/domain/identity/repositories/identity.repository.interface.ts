import type { User } from '../entities/user.entity';
import type { Organization } from '../entities/organization.entity';
import type { Bot } from '../entities/bot.entity';
import type { UserId } from '../value-objects/user-id.value-object';
import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { BotId } from '../value-objects/bot-id.value-object';

/**
 * IdentityRepository defines the domain-level contract for identity aggregates.
 * All methods return Promises and use domain entities/value objects only.
 */
export interface IdentityRepository {
  findUsers(): Promise<User[]>;
  findOrganizations(): Promise<Organization[]>;
  findBots(): Promise<Bot[]>;
  findUserById(userId: UserId): Promise<User | null>;
  findOrganizationById(organizationId: OrganizationId): Promise<Organization | null>;
  findBotById(botId: BotId): Promise<Bot | null>;
  saveUser(user: User): Promise<void>;
  saveOrganization(organization: Organization): Promise<void>;
  saveBot(bot: Bot): Promise<void>;
  deleteUser(userId: UserId): Promise<void>;
  deleteOrganization(organizationId: OrganizationId): Promise<void>;
  deleteBot(botId: BotId): Promise<void>;
}
