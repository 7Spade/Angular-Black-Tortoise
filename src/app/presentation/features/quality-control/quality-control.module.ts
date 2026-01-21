import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Quality Control Module
 * 
 * Skeleton module for quality control feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add quality control components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add quality control routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class QualityControlModule {}
