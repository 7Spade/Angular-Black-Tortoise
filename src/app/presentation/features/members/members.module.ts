import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Members Module
 * 
 * Skeleton module for member management feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add member components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add members routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class MembersModule {}
