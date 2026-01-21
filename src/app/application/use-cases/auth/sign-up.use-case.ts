import { inject, Injectable } from '@angular/core';
import type { UseCase } from '../base/use-case.interface';
import type { AuthCredentials, AuthUser } from '@domain/identity/entities/auth-user.entity';
import { AUTH_REPOSITORY } from '@application/tokens/repository.tokens';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import { AuthStore } from '@application/stores/auth.store';

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  user: AuthUser;
}

/**
 * Use Case: Register a new user with email and password.
 * 
 * Business Rules:
 * - Email and password are required
 * - Email must be unique (not already registered)
 * - Password must meet Firebase minimum requirements (6+ characters)
 * - On success, user is authenticated and session is established
 * - User profile document is created in Firestore
 * 
 * Architecture Compliance:
 * - Use Case orchestrates domain and infrastructure
 * - Calls repository (infrastructure layer)
 * - Updates store state (application layer)
 * - Returns Promise for async completion
 * - No business logic (registration logic is in repository/Firebase)
 */
@Injectable({ providedIn: 'root' })
export class SignUpUseCase implements UseCase<SignUpRequest, SignUpResponse> {
  private readonly repository = inject<AuthRepository>(AUTH_REPOSITORY);
  private readonly store = inject(AuthStore);

  async execute(request: SignUpRequest): Promise<SignUpResponse> {
    const credentials: AuthCredentials = {
      email: request.email,
      password: request.password,
    };

    // Set loading state
    this.store.setState({ loading: true, error: null });

    try {
      const user = await this.repository.signUp(credentials);
      
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
