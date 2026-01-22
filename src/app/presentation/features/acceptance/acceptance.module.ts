import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Acceptance Module
 * 
 * Architecture Compliance:
 * - Routes point to entry component
 * - Entry component handles layout/guard decisions
 * - Follows Angular 20 conventions with standalone components
 * - Minimal NgModule structure (legacy support)
 * 
 * Future: Migrate to standalone routes configuration
 */

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./acceptance-entry.component').then(
        (m) => m.AcceptanceEntryComponent
      ),
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class AcceptanceModule {}
