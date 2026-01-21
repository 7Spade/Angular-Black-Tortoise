import { Injectable, inject, computed } from '@angular/core';
import type { AuthStatus } from '@domain/identity/entities/auth-user.entity';
import { AuthStore } from '@application/stores/auth.store';
import { SignInUseCase, type SignInRequest } from '@application/use-cases/auth/sign-in.use-case';
import { SignUpUseCase, type SignUpRequest } from '@application/use-cases/auth/sign-up.use-case';
import { SignOutUseCase } from '@application/use-cases/auth/sign-out.use-case';
import {
  SendPasswordResetUseCase,
  type SendPasswordResetRequest,
} from '@application/use-cases/auth/send-password-reset.use-case';

export interface AuthStateSnapshot {
  readonly isAuthenticated: boolean;
  readonly sessionReady: boolean;
}

/**
 * Auth Session Facade
 * 
 * Architecture Compliance:
 * - Facade orchestrates use cases
 * - Exposes signals for UI consumption
 * - Provides action methods that call use cases
 * - NO business logic (orchestration only)
 * - NO repository access (use cases handle that)
 * - Computes navigation signals based on auth state
 * 
 * Responsibilities:
 * 1. Orchestrate auth use cases
 * 2. Expose read-only state signals
 * 3. Provide action methods for UI
 * 4. Compute navigation signals
 * 
 * Routing Integration:
 * - redirectPath returns /demo/ for authenticated users
 * - Components can watch this signal but routing is handled via route config
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionFacade {
  private readonly authStore = inject(AuthStore);
  private readonly signInUseCase = inject(SignInUseCase);
  private readonly signUpUseCase = inject(SignUpUseCase);
  private readonly signOutUseCase = inject(SignOutUseCase);
  private readonly sendPasswordResetUseCase = inject(SendPasswordResetUseCase);

  // Read-only state signals
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly authStatus = this.authStore.authStatus;
  readonly sessionReady = computed(() => this.authStore.status() !== 'initializing');
  readonly loading = computed(() => this.authStore.loading());
  readonly error = computed(() => this.authStore.error());
  readonly user = computed(() => this.authStore.user());

  /**
   * Navigation signal - computed from auth state
   * Returns the path to navigate to after authentication success
   * 
   * Architecture: Router decisions from facade signals only
   * Updated: Now redirects to /demo/ instead of /demo/workspace/default/default
   */
  readonly redirectPath = computed(() => {
    const status = this.authStore.status();
    // Only redirect when status changes to authenticated
    if (status === 'authenticated') {
      return '/demo';
    }
    return null;
  });

  /**
   * Get snapshot of current auth state
   */
  getSnapshot(): AuthStateSnapshot {
    return {
      isAuthenticated: this.isAuthenticated(),
      sessionReady: this.sessionReady(),
    };
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.authStore.clearError();
  }

  /**
   * Sign in with email and password
   * Orchestrates SignInUseCase
   */
  async signIn(request: SignInRequest): Promise<void> {
    try {
      await this.signInUseCase.execute(request);
    } catch (error) {
      // Error already handled in use case (updates store)
      console.error('Sign in error:', error);
    }
  }

  /**
   * Sign up new user with email and password
   * Orchestrates SignUpUseCase
   */
  async signUp(request: SignUpRequest): Promise<void> {
    try {
      await this.signUpUseCase.execute(request);
    } catch (error) {
      // Error already handled in use case (updates store)
      console.error('Sign up error:', error);
    }
  }

  /**
   * Sign out current user
   * Orchestrates SignOutUseCase
   */
  async signOut(): Promise<void> {
    try {
      await this.signOutUseCase.execute();
    } catch (error) {
      // Error already handled in use case (updates store)
      console.error('Sign out error:', error);
    }
  }

  /**
   * Send password reset email
   * Orchestrates SendPasswordResetUseCase
   */
  async sendPasswordReset(request: SendPasswordResetRequest): Promise<void> {
    try {
      await this.sendPasswordResetUseCase.execute(request);
    } catch (error) {
      // Error already handled in use case (updates store)
      console.error('Password reset error:', error);
    }
  }
}
