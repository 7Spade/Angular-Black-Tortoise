import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { UseCase } from '../base/use-case.interface';
import { AUTH_REPOSITORY } from '@application/tokens/repository.tokens';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import { AuthStore } from '@application/stores/auth.store';

export interface SendPasswordResetRequest {
  email: string;
}

export interface SendPasswordResetResponse {
  success: boolean;
}

/**
 * Use Case: Send password reset email to user.
 * 
 * Business Rules:
 * - Email must be provided
 * - Email should be registered (but Firebase doesn't reveal this for security)
 * - Password reset link is sent to the email
 * - Link expires after a certain time (Firebase default: 1 hour)
 * 
 * Architecture Compliance:
 * - Use Case orchestrates domain and infrastructure
 * - Calls repository (infrastructure layer)
 * - Updates store state (application layer)
 * - Returns Promise for async completion
 * - No business logic (password reset logic is in repository/Firebase)
 */
@Injectable({ providedIn: 'root' })
export class SendPasswordResetUseCase
  implements UseCase<SendPasswordResetRequest, SendPasswordResetResponse>
{
  private readonly repository = inject<AuthRepository>(AUTH_REPOSITORY);
  private readonly store = inject(AuthStore);

  async execute(request: SendPasswordResetRequest): Promise<SendPasswordResetResponse> {
    // Set loading state
    this.store.setState({ loading: true, error: null });

    try {
      await firstValueFrom(this.repository.sendPasswordReset(request.email));
      
      // Update store state on success (loading: false, no error)
      this.store.setState({
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error: unknown) {
      // Update store state on error
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.store.setState({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  }
}
