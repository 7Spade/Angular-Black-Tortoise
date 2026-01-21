import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
  type,
  getState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe } from 'rxjs';
import type {
  AuthStatus,
  AuthUser,
} from '@domain/identity/entities/auth-user.entity';
import { AUTH_REPOSITORY } from '@application/tokens/repository.tokens';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';

/**
 * Auth Store State Shape
 * 
 * Architecture Compliance:
 * - Store is a PURE STATE CONTAINER
 * - NO business logic (moved to use cases)
 * - NO repository calls for business operations (moved to use cases)
 * - ONLY state synchronization (syncAuthState) and state updates
 * - Use cases call patchState to update this store
 */
export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'initializing',
  loading: false,
  error: null,
};

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/**
 * Auth Store
 * 
 * Refactored to follow clean architecture:
 * - State management ONLY
 * - Business logic removed (now in use cases)
 * - Use cases update this store via exposed setState method
 * - syncAuthState monitors Firebase auth state changes
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => status() === 'authenticated'),
    authStatus: computed(() => status()),
    userId: computed(() => user()?.id.getValue() ?? null),
  })),
  withMethods((store, repository = inject<AuthRepository>(AUTH_REPOSITORY)) => ({
    /**
     * Clear error state
     */
    clearError(): void {
      patchState(store, { error: null });
    },
    
    /**
     * Update state - exposed for use cases
     */
    setState(update: Partial<AuthState>): void {
      patchState(store, update);
    },
    
    /**
     * Synchronize with Firebase auth state changes
     * This is the ONLY rxMethod remaining - it monitors auth state, not business operations
     */
    syncAuthState: rxMethod<void>(
      pipe(
        exhaustMap(() => repository.authState()),
        tapResponse({
          next: (user) =>
            patchState(store, {
              user,
              status: user ? 'authenticated' : 'unauthenticated',
              loading: false,
              error: null,
            }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      // Initialize auth state synchronization
      store.syncAuthState();
    },
  }),
);
