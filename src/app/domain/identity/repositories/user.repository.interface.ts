import type { User } from '../entities/user.entity';

/**
 * UserRepository defines the contract for user persistence.
 */
export interface UserRepository {
  getUsers(): Promise<User[]>;
  findById(userId: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
}
