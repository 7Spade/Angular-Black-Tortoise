import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { WorkspaceStore } from '@application/stores/workspace.store';

/**
 * Module Host Page Component
 *
 * This component serves as the host for workspace modules.
 * It dynamically loads and displays module content based on the route parameters.
 *
 * Route: /workspace/:id/:module
 *
 * Architecture:
 * - Pure presentation component (no business logic)
 * - Injects WorkspaceStore for workspace context
 * - Uses ActivatedRoute for module key parameter
 * - Uses @if/@for control flow (zone-less compatible)
 */
@Component({
  selector: 'app-module-host-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, TitleCasePipe],
  template: `
    <div class="module-host-container">
      @if (moduleKey(); as key) {
        <mat-card class="module-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>extension</mat-icon>
            <mat-card-title>{{ key | titlecase }} Module</mat-card-title>
            <mat-card-subtitle>
              Workspace: {{ workspaceStore.currentWorkspace()?.name ?? 'Loading...' }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="module-content">
              <p>Module content for <strong>{{ key }}</strong> will be loaded here.</p>
              <p class="placeholder-text">
                This is a placeholder for the dynamic module content.
                Each module will have its own component loaded dynamically.
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card class="error-card">
          <mat-card-content>
            <mat-icon>error_outline</mat-icon>
            <p>Invalid module configuration</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .module-host-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .module-card {
        min-height: 400px;
      }

      .module-content {
        padding: 16px 0;
      }

      .placeholder-text {
        color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
        font-style: italic;
        margin-top: 16px;
      }

      .error-card {
        text-align: center;
        padding: 48px;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: var(--mdc-theme-error, #b00020);
        }

        p {
          margin-top: 16px;
          color: var(--mdc-theme-error, #b00020);
        }
      }
    `,
  ],
})
export class ModuleHostPageComponent {
  private route = inject(ActivatedRoute);
  workspaceStore = inject(WorkspaceStore);

  // Convert route params to signal (zone-less compatible)
  moduleKey = toSignal(
    this.route.params.pipe(map((params) => params['module'])),
    { initialValue: null as string | null },
  );

  // Computed workspace ID from route
  workspaceId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(null),
    { initialValue: null as string | null },
  );
}
