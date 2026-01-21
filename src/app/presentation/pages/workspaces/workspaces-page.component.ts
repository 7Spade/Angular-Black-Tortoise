import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { WorkspaceFacade } from '@application/facades/workspace.facade';
import { AuthStore } from '@application/stores/auth.store';

/**
 * Workspaces Page Component
 * 
 * Purpose:
 * - Display all workspaces for the current user
 * - Allow creation of new workspaces
 * - Navigate to specific workspace details
 * 
 * DDD Architecture:
 * - Smart component (interacts with application layer)
 * - Uses facade pattern for all business operations
 * - Signals-only for reactive UI
 * - No direct store or use case access
 */
@Component({
  selector: 'app-workspaces-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspaces-container">
      <header class="workspaces-header">
        <h1>My Workspaces</h1>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="onCreateWorkspace()"
          [disabled]="workspaceFacade.loading() || !authStore.userId()"
        >
          <mat-icon>add</mat-icon>
          Create Workspace
        </button>
      </header>

      @if (workspaceFacade.loading()) {
        <div class="workspaces-loading">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Loading workspaces...</p>
        </div>
      } @else if (errorMessage()) {
        <mat-card class="workspaces-error">
          <mat-card-content>
            <mat-icon color="warn">error</mat-icon>
            <p>{{ errorMessage() }}</p>
            <button
              mat-button
              type="button"
              (click)="onRetry()"
            >
              Retry
            </button>
          </mat-card-content>
        </mat-card>
      } @else if (!workspaceFacade.hasWorkspaces()) {
        <mat-card class="workspaces-empty">
          <mat-card-content>
            <mat-icon>folder_open</mat-icon>
            <h2>No workspaces yet</h2>
            <p>Create your first workspace to get started.</p>
            <button
              mat-raised-button
              color="primary"
              type="button"
              (click)="onCreateWorkspace()"
            >
              <mat-icon>add</mat-icon>
              Create Workspace
            </button>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="workspaces-grid">
          @for (workspace of workspaceFacade.workspaces(); track workspace.id.getValue()) {
            <mat-card class="workspace-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>folder</mat-icon>
                <mat-card-title>Workspace {{ workspace.id.getValue().slice(0, 8) }}</mat-card-title>
                <mat-card-subtitle>
                  Owner: {{ workspace.owner.type }} ({{ workspace.owner.id }})
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Modules: {{ workspace.moduleIds.length }}</p>
              </mat-card-content>
              <mat-card-actions align="end">
                <button
                  mat-button
                  type="button"
                  (click)="onSelectWorkspace(workspace.id.getValue())"
                >
                  Open
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .workspaces-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .workspaces-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .workspaces-header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 400;
      }

      .workspaces-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        gap: 16px;
      }

      .workspaces-error,
      .workspaces-empty {
        text-align: center;
        padding: 48px;
      }

      .workspaces-error mat-icon,
      .workspaces-empty mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      .workspaces-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }

      .workspace-card {
        transition: transform 0.2s ease-in-out;
      }

      .workspace-card:hover {
        transform: translateY(-4px);
      }

      @media (max-width: 768px) {
        .workspaces-header {
          flex-direction: column;
          gap: 16px;
          align-items: stretch;
        }

        .workspaces-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class WorkspacesPageComponent {
  readonly workspaceFacade = inject(WorkspaceFacade);
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly creating = signal(false);
  readonly errorMessage = computed(() => this.workspaceFacade.error());

  constructor() {
    // Auto-load workspaces when component initializes
    effect(() => {
      const userId = this.authStore.userId();
      if (userId) {
        this.workspaceFacade.loadWorkspaces(userId, 'user');
      }
    });
  }

  async onCreateWorkspace(): Promise<void> {
    const userId = this.authStore.userId();
    if (!userId) {
      return;
    }

    this.creating.set(true);
    try {
      const workspaceId = await this.workspaceFacade.createWorkspace(
        userId,
        'user'
      );
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      this.creating.set(false);
    }
  }

  onSelectWorkspace(workspaceId: string): void {
    this.router.navigate(['/app/workspace', workspaceId]);
  }

  onRetry(): void {
    const userId = this.authStore.userId();
    if (userId) {
      this.workspaceFacade.clearError();
      this.workspaceFacade.loadWorkspaces(userId, 'user');
    }
  }
}
