import { Routes } from '@angular/router';
import { authGuard } from '@application/guards/auth.guard';

/**
 * App Routes
 * 
 * Architecture Compliance:
 * - Uses extracted authGuard (no inline logic)
 * - Clean, declarative route configuration
 * - Guard handles all auth checks via facade signals
 * - Signals-only redirects (no component-driven navigation)
 * 
 * Routing Requirements:
 * - / -> /demo/ (default landing)
 * - /login -> /demo/ (login shortcut redirects to demo)
 * - /demo/workspace/default/default -> /demo/ (legacy default redirects)
 * - /demo/ is publicly accessible (no auth required)
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/demo',
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: '/demo',
  },
  {
    path: 'auth/:mode',
    loadComponent: () =>
      import('./pages/auth/auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
  {
    path: 'demo',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/demo/demo-page.component').then(
        (module) => module.DemoPageComponent,
      ),
  },
  {
    path: 'demo/workspace/default/default',
    pathMatch: 'full',
    redirectTo: '/demo',
  },
  {
    path: 'demo/workspace/:workspaceId/:moduleId',
    loadComponent: () =>
      import('./pages/demo/demo-page.component').then(
        (module) => module.DemoPageComponent,
      ),
  },
  {
    path: 'app',
    canActivate: [authGuard],
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
    redirectTo: '/demo',
  },
];
