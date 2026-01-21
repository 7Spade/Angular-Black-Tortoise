import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
  {
    path: ':mode',
    loadComponent: () =>
      import('./auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
];
