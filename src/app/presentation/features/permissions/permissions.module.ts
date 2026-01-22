import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Permissions Module
 * 
 * Skeleton module for permissions management feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add permissions components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add permissions routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class PermissionsModule {}
