import type { AuthStatus } from '@domain/identity/entities/auth-user.entity';
import type { AuthStateSnapshot } from '@application/use-cases/auth/auth-state.use-case';
import { AuthStore } from '@application/stores/auth.store';
import { AuthStateUseCase } from '@application/use-cases/auth/auth-state.use-case';

export class AuthSessionFacade {
  readonly isAuthenticated: () => boolean;
  readonly authStatus: () => AuthStatus;

  constructor(
    private readonly authStore: ReturnType<typeof AuthStore>,
    private readonly authStateUseCase: AuthStateUseCase,
  ) {
    this.isAuthenticated = this.authStore.isAuthenticated;
    this.authStatus = this.authStore.authStatus;
  }

  getSnapshot(): AuthStateSnapshot {
    return this.authStateUseCase.deriveState({
      status: this.authStore.authStatus(),
    });
  }
}
