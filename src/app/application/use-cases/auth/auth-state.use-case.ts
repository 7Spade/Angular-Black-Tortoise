import type { AuthStatus } from '@domain/identity/entities/auth-user.entity';

export interface AuthStateSnapshot {
  readonly isAuthenticated: boolean;
  readonly sessionReady: boolean;
}

export interface AuthStateInput {
  readonly status: AuthStatus;
}

export class AuthStateUseCase {
  deriveState(input: AuthStateInput): AuthStateSnapshot {
    return {
      isAuthenticated: input.status === 'authenticated',
      sessionReady: input.status !== 'initializing',
    };
  }
}
