import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IdentitySwitcherComponent } from '@presentation/features/identity-switcher/identity-switcher.component';
import { WorkspaceSwitcherComponent } from '@presentation/features/workspace-switcher/workspace-switcher.component';

/**
 * Main Layout Component
 * Provides the global shell with header, sidebar, and content area
 * 
 * Presentation Layer - Layout Component
 * - Material Design 3 with Toolbar, Sidenav, and Content
 * - Integrates Identity and Workspace Switchers
 * - Follows spec: Header (64px, fixed) with Logo, Workspace Switcher, Search, Identity Switcher
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    IdentitySwitcherComponent,
    WorkspaceSwitcherComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  /**
   * Sidebar state
   */
  sidenavOpened = true;

  /**
   * Toggle sidebar
   */
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
