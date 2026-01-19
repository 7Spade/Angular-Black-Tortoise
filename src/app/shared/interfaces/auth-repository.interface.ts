import type { Observable } from 'rxjs';
import type {
  AuthCredentials,
  AuthProfileUpdate,
  AuthUser,
} from '@domain/account/entities/auth-user.entity';

export interface AuthRepository {
  authState(): Observable<AuthUser | null>;
  signIn(credentials: AuthCredentials): Observable<AuthUser>;
  signUp(credentials: AuthCredentials): Observable<AuthUser>;
  signOut(): Observable<void>;
  sendPasswordReset(email: string): Observable<void>;
  updateProfile(update: AuthProfileUpdate): Observable<AuthUser>;
}
