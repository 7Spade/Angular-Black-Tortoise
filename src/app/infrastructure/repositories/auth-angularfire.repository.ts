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
import { from, map, Observable, throwError } from 'rxjs';
import type { User } from '@angular/fire/auth';
import type {
  AuthCredentials,
  AuthProfileUpdate,
  AuthUser,
} from '@domain/account/entities/auth-user.entity';
import type { AuthRepository } from '@shared/interfaces/auth-repository.interface';

const toAuthUser = (authUser: User): AuthUser => ({
  id: authUser.uid,
  email: authUser.email ?? '',
  displayName: authUser.displayName ?? '',
  photoUrl: authUser.photoURL ?? '',
  emailVerified: authUser.emailVerified,
});

@Injectable()
export class AuthAngularFireRepository implements AuthRepository {
  private readonly auth = inject(Auth);

  authState(): Observable<AuthUser | null> {
    return user(this.auth).pipe(
      map((currentUser) => (currentUser ? toAuthUser(currentUser) : null)),
    );
  }

  signIn(credentials: AuthCredentials): Observable<AuthUser> {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      ),
    ).pipe(map((result) => toAuthUser(result.user)));
  }

  signUp(credentials: AuthCredentials): Observable<AuthUser> {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      ),
    ).pipe(map((result) => toAuthUser(result.user)));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  sendPasswordReset(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  updateProfile(update: AuthProfileUpdate): Observable<AuthUser> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user.'));
    }
    return from(
      updateProfile(currentUser, {
        displayName: update.displayName,
        photoURL: update.photoUrl,
      }),
    ).pipe(map(() => toAuthUser(currentUser)));
  }
}
