import type { AuthUser, AuthCredentials, AuthProfileUpdate } from '../entities/auth-user.entity';

/**
 * AuthRepository defines the contract for authentication operations.
 * Returns Promises for framework-agnostic async operations (DDD requirement).
 */
export interface AuthRepository {
  authState(): Promise<AuthUser | null>;
  signIn(credentials: AuthCredentials): Promise<AuthUser>;
  signUp(credentials: AuthCredentials): Promise<AuthUser>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  updateProfile(update: AuthProfileUpdate): Promise<AuthUser>;
}
