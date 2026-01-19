import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { Email } from '../../shared/value-objects/email.value-object';
import type { User } from '../entities/user.entity';
import type { Organization } from '../entities/organization.entity';
import type { Bot } from '../entities/bot.entity';

/**
 * IdentityRepository defines the contract for identity persistence.
 * Pure interface with Promise-based methods as per STEP 4 requirements.
 */
export interface IdentityRepository {
  // User operations
  findUserById(id: IdentityId): Promise<User | null>;
  findUserByEmail(email: Email): Promise<User | null>;
  findAllUsers(): Promise<User[]>;
  findUsersByOrganizationId(organizationId: IdentityId): Promise<User[]>;
  saveUser(user: User): Promise<void>;
  
  // Organization operations
  findOrganizationById(id: IdentityId): Promise<Organization | null>;
  findAllOrganizations(): Promise<Organization[]>;
  findOrganizationsByUserId(userId: IdentityId): Promise<Organization[]>;
  saveOrganization(org: Organization): Promise<void>;
  
  // Bot operations
  findBotById(id: IdentityId): Promise<Bot | null>;
  findAllBots(): Promise<Bot[]>;
  saveBot(bot: Bot): Promise<void>;

  // Query methods for application layer
  getUsers(): Promise<User[]>;
  getOrganizations(): Promise<Organization[]>;
  getBots(): Promise<Bot[]>;
}
