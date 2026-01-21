import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/**
 * Documents Module
 * 
 * Skeleton module for document management feature.
 * Follows Angular 20 conventions with minimal NgModule structure.
 * 
 * Future: Add document components, services, and business logic.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Add documents routes
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class DocumentsModule {}
