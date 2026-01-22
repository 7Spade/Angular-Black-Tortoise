import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Audit Module
 * 
 * Skeleton module for audit log feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add audit components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add audit routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class AuditModule {}
