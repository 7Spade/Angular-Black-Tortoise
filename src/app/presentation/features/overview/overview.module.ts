import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Overview Module
 * 
 * Skeleton module for workspace overview feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add overview components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add overview routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class OverviewModule {}
