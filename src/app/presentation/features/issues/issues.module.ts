import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Issues Module
 * 
 * Skeleton module for issue tracking feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add issue components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add issues routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class IssuesModule {}
