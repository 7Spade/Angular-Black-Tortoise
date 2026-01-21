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
      import('./layouts/main-layout/main-layout.component').then(
        (module) => module.MainLayoutComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/workspace-selection/workspace-selection-page.component').then(
            (module) => module.WorkspaceSelectionPageComponent,
          ),
      },
    ],
  },
  {
    path: 'workspace/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/workspace-layout/workspace-layout.component').then(
        (module) => module.WorkspaceLayoutComponent,
      ),
    children: [
      {
        path: ':module',
        loadComponent: () =>
          import('./pages/module-host/module-host.component').then(
            (module) => module.ModuleHostComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
