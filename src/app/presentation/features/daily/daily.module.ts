import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Daily Module
 * 
 * Skeleton module for daily operations feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add daily components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add daily routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class DailyModule {}
