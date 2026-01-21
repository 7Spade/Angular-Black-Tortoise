import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Settings Module
 * 
 * Skeleton module for application settings feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add settings components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add settings routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class SettingsModule {}
