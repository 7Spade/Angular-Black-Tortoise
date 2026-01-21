import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Routes, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/auth/auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
  {
    path: 'demo/workspace/:workspaceId/:moduleId',
    canActivate: [
      () => {
        const session = inject(AuthSessionFacade);
        return toObservable(session.authStatus).pipe(
          filter((status) => status !== 'initializing'),
          take(1),
          map((status) =>
            status === 'authenticated' ? true : inject(Router).parseUrl('/login'),
          ),
        );
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
        return toObservable(session.authStatus).pipe(
          filter((status) => status !== 'initializing'),
          take(1),
          map((status) =>
            status === 'authenticated' ? true : inject(Router).parseUrl('/login'),
          ),
        );
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
    loadComponent: () =>
      import('./pages/auth/auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
];
