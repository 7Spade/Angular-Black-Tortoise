import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { Email } from '../value-objects/email.value-object';
import type { User } from '../entities/user.entity';
import type { Organization } from '../entities/organization.entity';
import type { Bot } from '../entities/bot.entity';

/**
 * IdentityRepository defines the contract for identity persistence.
 * Pure interface with Promise-based methods as per STEP 4 requirements.
 */
export interface IdentityRepository {
  findUserById(id: IdentityId): Promise<User | null>;
  findUserByEmail(email: Email): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  findOrganizationById(id: IdentityId): Promise<Organization | null>;
  saveOrganization(org: Organization): Promise<void>;
  findBotById(id: IdentityId): Promise<Bot | null>;
  saveBot(bot: Bot): Promise<void>;
}
