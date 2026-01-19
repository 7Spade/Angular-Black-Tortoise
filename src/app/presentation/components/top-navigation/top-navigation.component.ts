import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { IdentityStore } from '@application/stores/identity.store';
import {
  IdentitySelection,
  IdentitySwitcherComponent,
} from '../identity-switcher/identity-switcher.component';
import {
  WorkspaceSelection,
  WorkspaceSwitcherComponent,
} from '../workspace-switcher/workspace-switcher.component';

@Component({
  selector: 'app-top-navigation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    IdentitySwitcherComponent,
    WorkspaceSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar color="primary" class="top-navigation">
      <!-- Logo/Brand Section -->
      <div class="brand-section">
        <button
          mat-icon-button
          type="button"
          (click)="goHome()"
          class="logo-button"
        >
          <mat-icon>rocket_launch</mat-icon>
        </button>
        <span class="app-name">Black Tortoise</span>
      </div>

      <!-- Spacer -->
      <span class="spacer"></span>

      <!-- Identity & Workspace Controls -->
      <div class="controls-section">
        <app-identity-switcher
          (identityChanged)="onIdentityChanged($event)"
        />

        @if (identityStore.activeWorkspaceOwner()) {
          <app-workspace-switcher
            (workspaceChanged)="onWorkspaceChanged($event)"
          />
        }
      </div>

      <!-- User Avatar/Menu -->
      <div class="user-section">
        @if (identityStore.currentUser(); as user) {
          <button
            mat-icon-button
            type="button"
            [matMenuTriggerFor]="userMenu"
            class="user-avatar"
          >
            <mat-icon>account_circle</mat-icon>
          </button>
        }
      </div>
    </mat-toolbar>

    <!-- User Menu (placeholder for future implementation) -->
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item type="button">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item type="button">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item type="button">
        <mat-icon>logout</mat-icon>
        <span>Sign Out</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .top-navigation {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
        box-shadow: var(--mat-sys-level2);

        .brand-section {
          display: flex;
          align-items: center;
          gap: 8px;

          .logo-button {
            margin: 0;
          }

          .app-name {
            font: var(--mat-sys-title-medium);
            font-weight: 500;

            @media (max-width: 768px) {
              display: none;
            }
          }
        }

        .spacer {
          flex: 1 1 auto;
        }

        .controls-section {
          display: flex;
          align-items: center;
          gap: 12px;

          @media (max-width: 768px) {
            gap: 8px;
          }
        }

        .user-section {
          display: flex;
          align-items: center;

          .user-avatar {
            margin: 0;
          }
        }
      }
    `,
  ],
})
export class TopNavigationComponent {
  readonly identityStore = inject(IdentityStore);
  private readonly router = inject(Router);

  onIdentityChanged(selection: IdentitySelection): void {
    console.log('Identity changed:', selection);
    // Future: Handle identity switch navigation if needed
  }

  onWorkspaceChanged(selection: WorkspaceSelection): void {
    console.log('Workspace changed:', selection);
    // Navigate to workspace view
    void this.router.navigate(['/workspace', selection.workspaceId]);
  }

  goHome(): void {
    void this.router.navigate(['/app']);
  }
}
