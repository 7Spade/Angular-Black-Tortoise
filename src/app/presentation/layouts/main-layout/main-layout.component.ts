import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IdentitySwitcherComponent } from '../../components/identity-switcher/identity-switcher.component';
import { WorkspaceSwitcherComponent } from '../../components/workspace-switcher/workspace-switcher.component';

/**
 * Main Layout Component
 * 
 * Provides the shell for authenticated pages with:
 * - Header with Identity Switcher and Workspace Switcher
 * - Router outlet for page content
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    IdentitySwitcherComponent,
    WorkspaceSwitcherComponent,
  ],
  template: `
    <div class="main-layout">
      <!-- Header with switchers -->
      <mat-toolbar class="main-header" color="primary">
        <!-- Left: Logo and Workspace Switcher -->
        <div class="header-left">
          <button mat-icon-button class="logo-button" aria-label="Application logo">
            <mat-icon>workspace_premium</mat-icon>
          </button>
          <app-workspace-switcher></app-workspace-switcher>
        </div>

        <!-- Spacer -->
        <span class="header-spacer"></span>

        <!-- Right: Identity Switcher -->
        <div class="header-right">
          <app-identity-switcher></app-identity-switcher>
        </div>
      </mat-toolbar>

      <!-- Content area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .main-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
      }

      .main-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
        height: 64px;
        flex-shrink: 0;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-button {
        margin-right: 4px;
      }

      .header-spacer {
        flex: 1 1 auto;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .main-content {
        flex: 1 1 auto;
        overflow: auto;
        background: var(--mat-sys-surface, #fafafa);
      }
    `,
  ],
})
export class MainLayoutComponent {}
