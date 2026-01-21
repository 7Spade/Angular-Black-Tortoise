import { Injectable, inject, computed } from '@angular/core';
import type { AuthStatus } from '@domain/identity/entities/auth-user.entity';
import { AuthStore } from '@application/stores/auth.store';

export interface AuthStateSnapshot {
  readonly isAuthenticated: boolean;
  readonly sessionReady: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthSessionFacade {
  private readonly authStore = inject(AuthStore);

  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly authStatus = this.authStore.authStatus;
  readonly sessionReady = computed(() => this.authStore.status() !== 'initializing');

  getSnapshot(): AuthStateSnapshot {
    return {
      isAuthenticated: this.isAuthenticated(),
      sessionReady: this.sessionReady(),
    };
  }
}
