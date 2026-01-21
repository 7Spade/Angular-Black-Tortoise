import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Tasks Module
 * 
 * Skeleton module for task management feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add task components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add tasks routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class TasksModule {}
