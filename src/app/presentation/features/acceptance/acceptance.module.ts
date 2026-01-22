import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Acceptance Module
 * 
 * Skeleton module for acceptance testing/approval feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add acceptance components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add acceptance routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class AcceptanceModule {}
