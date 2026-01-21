import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import { AUTH_REPOSITORY } from '@application/tokens/repository.tokens';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import { AuthStore } from '@application/stores/auth.store';

export type SignOutRequest = void;

export interface SignOutResponse {
  success: boolean;
}

/**
 * Use Case: Sign out the current user.
 * 
 * Business Rules:
 * - User must be authenticated to sign out
 * - On success, session is cleared and user is unauthenticated
 * - Firebase auth state is cleared
 * - All local state is reset
 * 
 * Architecture Compliance:
 * - Use Case orchestrates domain and infrastructure
 * - Calls repository (infrastructure layer)
 * - Updates store state (application layer)
 * - Returns Promise for async completion
 * - No business logic (sign out logic is in repository/Firebase)
 */
@Injectable({ providedIn: 'root' })
export class SignOutUseCase implements UseCase<SignOutRequest, SignOutResponse> {
  private readonly repository = inject<AuthRepository>(AUTH_REPOSITORY);
  private readonly store = inject(AuthStore);

  async execute(_request?: SignOutRequest): Promise<SignOutResponse> {
    // Set loading state
    this.store.setState({ loading: true, error: null });

    try {
      await this.repository.signOut();
      
      // Update store state on success
      this.store.setState({
        user: null,
        status: 'unauthenticated',
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error: unknown) {
      // Update store state on error
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.store.setState({
        error: errorMessage,
        status: 'error',
        loading: false,
      });
      throw error;
    }
  }
}
