import type { User } from '../entities/user.entity';
import type { UserId } from '../value-objects/user-id.value-object';

/**
 * UserRepository defines the contract for user persistence.
 */
export interface UserRepository {
  findById(userId: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(userId: UserId): Promise<void>;
}
