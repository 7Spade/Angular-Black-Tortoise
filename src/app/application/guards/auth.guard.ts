import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

/**
 * Auth Guard
 * 
 * Architecture Compliance:
 * - Uses AuthSessionFacade ONLY (not AuthStore)
 * - Reads facade signals directly (no Observable/subscribe)
 * - No business logic, only signal-based checks
 * - Router decisions based on facade signals
 * 
 * DDD/Signals Rules Compliance:
 * - Rule 123: Guards must read Signal-based stores directly, not use subscribe/toObservable
 * - Rule 59/144: Guards are pure, signals-only checks
 * - No side effects, navigation, or data mutation
 * 
 * Responsibilities:
 * 1. Check authentication status via facade signals
 * 2. Allow or redirect based on status
 * 3. NO business logic
 * 4. Synchronous signal access only
 * 
 * Routing Logic:
 * - Protected routes (/app/*) require authentication
 * - Public routes (/demo, /auth) are always accessible
 * - Unauthenticated users accessing protected routes -> redirect to /auth/login
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const facade = inject(AuthSessionFacade);
  const router = inject(Router);
  
  // Read auth status signal directly (signals-only pattern)
  const status = facade.authStatus();
  
  // Wait for initialization - if still initializing, allow navigation
  // The component will handle showing loading state
  if (status === 'initializing') {
    return true;
  }
  
  // Allow access if authenticated
  if (status === 'authenticated') {
    return true;
  }
  
  // Redirect to login for unauthenticated users trying to access protected routes
  return router.parseUrl('/auth/login');
};
