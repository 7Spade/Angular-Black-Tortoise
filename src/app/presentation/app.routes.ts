import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
  {
    path: 'login/:mode',
    loadComponent: () =>
      import('./pages/auth/auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
  {
    path: 'demo',
    canActivate: [
      () => {
        const session = inject(AuthSessionFacade);
        const snapshot = session.getSnapshot();
        return snapshot.sessionReady && snapshot.isAuthenticated
          ? true
          : inject(Router).parseUrl('/login');
      },
    ],
    loadComponent: () =>
      import('./pages/demo/demo-page.component').then(
        (module) => module.DemoPageComponent,
      ),
  },
  {
    path: 'app',
    canActivate: [
      () => {
        const session = inject(AuthSessionFacade);
        const snapshot = session.getSnapshot();
        return snapshot.sessionReady && snapshot.isAuthenticated
          ? true
          : inject(Router).parseUrl('/login');
      },
    ],
    loadComponent: () =>
      import('./layouts/main-layout.component').then(
        (module) => module.MainLayoutComponent,
      ),
    children: [
      {
        path: 'workspaces',
        loadComponent: () =>
          import('./pages/workspaces/workspaces-page.component').then(
            (module) => module.WorkspacesPageComponent,
          ),
      },
      {
        path: 'workspace/:id',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
