import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthStore } from '@application/stores/auth.store';

export const authGuard: CanActivateFn = (_route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return toObservable(authStore.authStatus).pipe(
    filter((status) => status !== 'initializing'),
    take(1),
    map((status) => {
      if (status === 'authenticated') {
        return true;
      }
      if (state.url.startsWith('/login')) {
        return true;
      }
      return router.parseUrl('/login');
    }),
  );
};
