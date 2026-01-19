import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TopNavigationComponent } from '@presentation/components/top-navigation/top-navigation.component';

/**
 * Workspace Layout Component
 *
 * Main layout wrapper for workspace views with:
 * - Top navigation bar (identity switcher, workspace switcher)
 * - Responsive sidebar (optional, for future module navigation)
 * - Router outlet for module content
 *
 * Architecture:
 * - Presentation layer (zone-less, standalone)
 * - Material Design 3 components
 * - Responsive design (mobile-first)
 */
@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, TopNavigationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-layout">
      <!-- Top Navigation -->
      <app-top-navigation />

      <!-- Main Content Area with Optional Sidebar -->
      <mat-sidenav-container class="workspace-container">
        <!-- Sidebar (optional, for future module navigation) -->
        <mat-sidenav
          mode="side"
          opened="false"
          class="workspace-sidenav"
          #sidenav
        >
          <div class="sidenav-content">
            <p class="placeholder">Module Navigation (Coming Soon)</p>
          </div>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="workspace-content">
          <div class="content-wrapper">
            <router-outlet />
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      .workspace-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }

      .workspace-container {
        flex: 1;
        overflow: hidden;
      }

      .workspace-sidenav {
        width: 250px;
        border-right: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
        background: var(--mat-sys-surface, #ffffff);

        .sidenav-content {
          padding: 16px;
          height: 100%;
          overflow-y: auto;

          .placeholder {
            color: var(--mat-sys-on-surface-variant, #49454f);
            font: var(--mat-sys-body-small);
            text-align: center;
            margin-top: 24px;
          }
        }
      }

      .workspace-content {
        background: var(--mat-sys-surface-container-low, #f7f2fa);
        overflow-y: auto;

        .content-wrapper {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;

          @media (max-width: 768px) {
            padding: 16px;
          }
        }
      }
    `,
  ],
})
export class WorkspaceLayoutComponent {}
