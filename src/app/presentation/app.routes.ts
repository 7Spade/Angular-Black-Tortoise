import { Routes } from '@angular/router';
import { authGuard } from '@application/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout.component').then(
        (module) => module.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent
          ),
      },
      {
        path: 'workspaces',
        loadComponent: () =>
          import('./pages/workspaces/workspaces-page.component').then(
            (module) => module.WorkspacesPageComponent
          ),
      },
      {
        path: 'workspace/:id',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
