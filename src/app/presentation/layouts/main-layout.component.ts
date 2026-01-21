import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStore } from '@application/stores/auth.store';

/**
 * Main Layout Component - Application Shell
 * 
 * Architecture:
 * - Smart component that manages layout state
 * - Uses Material Design 3 components
 * - Fully responsive with mobile-first approach
 * - Zone-less compatible (signals only)
 * 
 * Features:
 * - Collapsible side navigation
 * - Top toolbar with user menu
 * - Responsive breakpoints
 * - Accessible navigation
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-sidenav-container class="layout-container">
      <!-- Side Navigation -->
      <mat-sidenav
        #sidenav
        mode="side"
        [opened]="sidenavOpened()"
        class="layout-sidenav"
      >
        <mat-nav-list>
          <a mat-list-item routerLink="/app/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/app/workspaces" routerLinkActive="active">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Workspaces</span>
          </a>
          <a mat-list-item routerLink="/app/demo" routerLinkActive="active">
            <mat-icon matListItemIcon>developer_mode</mat-icon>
            <span matListItemTitle>Demo</span>
          </a>
          <a mat-list-item routerLink="/app/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="layout-content">
        <!-- Toolbar -->
        <mat-toolbar color="primary" class="layout-toolbar">
          <button
            mat-icon-button
            type="button"
            (click)="toggleSidenav()"
            aria-label="Toggle navigation"
          >
            <mat-icon>menu</mat-icon>
          </button>
          <h1 class="layout-title">Angular Black Tortoise</h1>
          <span class="layout-spacer"></span>
          @if (authStore.user(); as user) {
            <span class="layout-user">{{ user.email }}</span>
          }
          <button
            mat-icon-button
            type="button"
            (click)="onSignOut()"
            aria-label="Sign out"
          >
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <!-- Page Content -->
        <main class="layout-main">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
      }

      .layout-sidenav {
        width: 240px;
        padding-top: 16px;
      }

      .layout-content {
        display: flex;
        flex-direction: column;
      }

      .layout-toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
      }

      .layout-title {
        margin: 0 16px;
        font-size: 20px;
        font-weight: 500;
      }

      .layout-spacer {
        flex: 1 1 auto;
      }

      .layout-user {
        margin-right: 16px;
        font-size: 14px;
      }

      .layout-main {
        flex: 1;
        overflow: auto;
        padding: 24px;
        background: var(--mat-sys-surface, #fafafa);
      }

      @media (max-width: 768px) {
        .layout-sidenav {
          width: 200px;
        }

        .layout-title {
          font-size: 16px;
        }

        .layout-user {
          display: none;
        }

        .layout-main {
          padding: 16px;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly sidenavOpened = signal(true);

  toggleSidenav(): void {
    this.sidenavOpened.update((opened) => !opened);
  }

  onSignOut(): void {
    this.authStore.signOut();
    this.router.navigate(['/auth/login']);
  }
}
