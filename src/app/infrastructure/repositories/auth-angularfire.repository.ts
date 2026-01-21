import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Firestore, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import type { User } from '@angular/fire/auth';
import type {
  AuthCredentials,
  AuthProfileUpdate,
} from '@domain/identity/entities/auth-user.entity';
import { AuthUser } from '@domain/identity/entities/auth-user.entity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import { Collections } from '../collections/collection-names';

/**
 * Map Firebase Auth User to the domain AuthUser entity.
 */
const toAuthUser = (authUser: User): AuthUser => {
  const id = IdentityId.create(authUser.uid);
  const email = Email.create(authUser.email ?? '');
  return AuthUser.create({
    id,
    email,
    emailVerified: authUser.emailVerified,
  });
};

const createUserProfilePayload = (
  authUser: User,
  credentials: AuthCredentials,
) => ({
  id: authUser.uid,
  email: authUser.email ?? credentials.email,
  displayName: authUser.displayName ?? '',
  photoURL: authUser.photoURL ?? '',
  createdAt: serverTimestamp(),
  organizationIds: [],
  teamIds: [],
  partnerIds: [],
  workspaceIds: [],
});

@Injectable()
export class AuthAngularFireRepository implements AuthRepository {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  async authState(): Promise<AuthUser | null> {
    const currentUser = this.auth.currentUser;
    return currentUser ? toAuthUser(currentUser) : null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const currentUser = this.auth.currentUser;
    return currentUser ? toAuthUser(currentUser) : null;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthUser> {
    const result = await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
    return toAuthUser(result.user);
  }

  async signUp(credentials: AuthCredentials): Promise<AuthUser> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
    return this.createUserProfile(result.user, credentials);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async updateProfile(update: AuthProfileUpdate): Promise<AuthUser> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user.');
    }
    const profileUpdate: { displayName?: string | null; photoURL?: string | null } = {};
    if (update.displayName !== undefined) {
      profileUpdate.displayName = update.displayName;
    }
    if (update.photoUrl !== undefined) {
      profileUpdate.photoURL = update.photoUrl;
    }
    await updateProfile(currentUser, profileUpdate);
    await currentUser.reload();
    return toAuthUser(currentUser);
  }

  private async createUserProfile(
    authUser: User,
    credentials: AuthCredentials,
  ): Promise<AuthUser> {
    try {
      await setDoc(
        doc(this.firestore, Collections.users, authUser.uid),
        createUserProfilePayload(authUser, credentials),
      );
      return toAuthUser(authUser);
    } catch (error) {
      const email = authUser.email ?? credentials.email;
      console.error('User profile save failed after sign-up.', {
        uid: authUser.uid,
        email,
        error,
      });
      try {
        await authUser.delete();
      } catch (rollbackError) {
        console.error(
          'Rollback failed after user profile creation error.',
          rollbackError,
        );
      }
      const message =
        error instanceof Error
          ? error.message
          : 'User profile creation failed.';
      console.error('User profile persistence error detail:', message);
      throw new Error(
        'Unable to complete registration. Please try again, and contact support if the issue persists.',
      );
    }
  }
}
