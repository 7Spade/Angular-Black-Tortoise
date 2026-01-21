import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

/**
 * Auth Guard
 * 
 * Architecture Compliance:
 * - Uses AuthSessionFacade ONLY (not AuthStore)
 * - Reads facade signals only (no business logic)
 * - No repository or service initialization
 * - Router decisions based on facade signals
 * 
 * Responsibilities:
 * 1. Check authentication status via facade
 * 2. Allow or redirect based on status
 * 3. NO business logic
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const facade = inject(AuthSessionFacade);
  const router = inject(Router);
  
  return toObservable(facade.authStatus).pipe(
    // Wait for auth initialization to complete
    filter((status) => status !== 'initializing'),
    take(1),
    map((status) => {
      // Allow access if authenticated
      if (status === 'authenticated') {
        return true;
      }
      
      // Allow access to login page
      if (state.url.startsWith('/login') || state.url.startsWith('/auth')) {
        return true;
      }
      
      // Redirect to login for unauthenticated users
      return router.parseUrl('/auth/login');
    }),
  );
};
