import { Injectable, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

@Injectable({ providedIn: 'root' })
export class AuthSessionNavigatorService {
  private readonly authSession = inject(AuthSessionFacade);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const snapshot = this.authSession.getSnapshot();
      if (snapshot.sessionReady) {
        this.router.navigateByUrl(
          snapshot.isAuthenticated
            ? '/demo/workspace/context-only/module-only'
            : '/login',
        );
      }
    });
  }
}
