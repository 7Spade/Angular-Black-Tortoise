import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import type { AuthCredentials, AuthUser } from '@domain/identity/entities/auth-user.entity';
import { AUTH_REPOSITORY } from '@application/tokens/repository.tokens';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import { AuthStore } from '@application/stores/auth.store';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: AuthUser;
}

/**
 * Use Case: Sign in an existing user with email and password.
 * 
 * Business Rules:
 * - Email and password are required
 * - Credentials must match an existing Firebase user
 * - On success, user is authenticated and session is established
 * - On failure, appropriate error is returned
 * 
 * Architecture Compliance:
 * - Use Case orchestrates domain and infrastructure
 * - Calls repository (infrastructure layer)
 * - Updates store state (application layer)
 * - Returns Promise for async completion
 * - No business logic (authentication logic is in repository/Firebase)
 */
@Injectable({ providedIn: 'root' })
export class SignInUseCase implements UseCase<SignInRequest, SignInResponse> {
  private readonly repository = inject<AuthRepository>(AUTH_REPOSITORY);
  private readonly store = inject(AuthStore);

  async execute(request: SignInRequest): Promise<SignInResponse> {
    const credentials: AuthCredentials = {
      email: request.email,
      password: request.password,
    };

    // Set loading state
    this.store.setState({ loading: true, error: null });

    try {
      const user = await this.repository.signIn(credentials);
      
      // Update store state on success
      this.store.setState({
        user,
        status: 'authenticated',
        loading: false,
        error: null,
      });

      return { user };
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
