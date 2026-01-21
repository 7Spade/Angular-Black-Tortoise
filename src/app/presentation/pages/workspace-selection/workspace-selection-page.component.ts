import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkspaceStore } from '@application/stores/workspace.store';
import { IdentityStore } from '@application/stores/identity.store';
import { AuthStore } from '@application/stores/auth.store';

/**
 * Workspace Selection Page
 * 
 * Displays list of available workspaces for the current identity.
 * Allows users to:
 * - View workspaces they own or have access to
 * - Select a workspace to enter
 * - Create a new workspace
 */
@Component({
  selector: 'app-workspace-selection-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="workspace-selection">
      <div class="workspace-selection-container">
        <header class="selection-header">
          <h1 class="selection-title">Select a Workspace</h1>
          <p class="selection-subtitle">
            Choose a workspace to continue or create a new one
          </p>
        </header>

        @if (workspaceStore.loading()) {
          <div class="loading-state">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading your workspaces...</p>
          </div>
        } @else if (workspaceStore.error()) {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <p class="error-message">{{ workspaceStore.error() }}</p>
            <button mat-stroked-button (click)="onRetry()">
              Retry
            </button>
          </div>
        } @else {
          <!-- Workspace Grid -->
          <div class="workspace-grid">
            <!-- Existing Workspaces -->
            @for (workspace of workspaceStore.workspaces(); track workspace.id.getValue()) {
              <mat-card class="workspace-card" (click)="onSelectWorkspace(workspace.id.getValue())">
                <mat-card-header>
                  <div mat-card-avatar class="workspace-avatar">
                    <mat-icon>folder</mat-icon>
                  </div>
                  <mat-card-title>{{ workspace.name.getValue() }}</mat-card-title>
                  <mat-card-subtitle>
                    {{ getWorkspaceOwnerTypeLabel(workspace.owner.ownerType) }}
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="workspace-stats">
                    <span class="stat-item">
                      <mat-icon>extension</mat-icon>
                      <span>{{ getModuleCount(workspace) }} modules</span>
                    </span>
                    <span class="stat-item">
                      <mat-icon>schedule</mat-icon>
                      <span>{{ formatDate(workspace.createdAt.getValue()) }}</span>
                    </span>
                  </div>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button color="primary">
                    Open
                    <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            }

            <!-- Create New Workspace Card -->
            <mat-card class="workspace-card create-card" (click)="onCreateWorkspace()">
              <mat-card-content class="create-content">
                <div class="create-icon">
                  <mat-icon>add_circle_outline</mat-icon>
                </div>
                <h3>Create New Workspace</h3>
                <p>Start a fresh workspace for your projects</p>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Empty State -->
          @if (workspaceStore.workspaces().length === 0) {
            <div class="empty-state">
              <mat-icon>folder_open</mat-icon>
              <h3>No Workspaces Yet</h3>
              <p>Create your first workspace to get started</p>
              <button mat-raised-button color="primary" (click)="onCreateWorkspace()">
                <mat-icon>add</mat-icon>
                Create Workspace
              </button>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [
    `
      .workspace-selection {
        min-height: 100%;
        padding: 48px 24px;
        background: var(--mat-sys-surface, #fafafa);
      }

      .workspace-selection-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .selection-header {
        margin-bottom: 32px;
        text-align: center;
      }

      .selection-title {
        font: var(--mat-sys-headline-large);
        margin: 0 0 8px 0;
        color: var(--mat-sys-on-surface);
      }

      .selection-subtitle {
        font: var(--mat-sys-body-large);
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
      }

      .loading-state,
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 64px 24px;
      }

      .error-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--mat-sys-error);
      }

      .error-message {
        font: var(--mat-sys-body-large);
        color: var(--mat-sys-error);
        text-align: center;
        max-width: 400px;
      }

      .workspace-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
      }

      .workspace-card {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .workspace-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--mat-sys-level3);
      }

      .workspace-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--mat-sys-corner-full);
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }

      .workspace-stats {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }

      .stat-item mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .create-card {
        border: 2px dashed var(--mat-sys-outline);
        background: var(--mat-sys-surface-container);
      }

      .create-card:hover {
        border-color: var(--mat-sys-primary);
        background: var(--mat-sys-primary-container);
      }

      .create-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 48px 24px;
        min-height: 200px;
      }

      .create-icon mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--mat-sys-primary);
      }

      .create-content h3 {
        font: var(--mat-sys-title-medium);
        margin: 16px 0 8px 0;
        color: var(--mat-sys-on-surface);
      }

      .create-content p {
        font: var(--mat-sys-body-medium);
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 64px 24px;
        text-align: center;
      }

      .empty-state mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: var(--mat-sys-on-surface-variant);
        opacity: 0.5;
      }

      .empty-state h3 {
        font: var(--mat-sys-headline-small);
        margin: 0;
        color: var(--mat-sys-on-surface);
      }

      .empty-state p {
        font: var(--mat-sys-body-large);
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
        max-width: 400px;
      }
    `,
  ],
})
export class WorkspaceSelectionPageComponent {
  readonly workspaceStore = inject(WorkspaceStore);
  readonly identityStore = inject(IdentityStore);
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  constructor() {
    // Initialize workspace owner when component loads
    effect(() => {
      const user = this.authStore.user();
      if (user && !this.identityStore.hasWorkspaceOwner()) {
        // Set the current user as the workspace owner
        this.identityStore.selectWorkspaceOwner('user', user.id.getValue());
      }
    });
  }

  /**
   * Handle workspace selection
   */
  onSelectWorkspace(workspaceId: string): void {
    this.workspaceStore.selectWorkspace(workspaceId);
    this.router.navigate(['/workspace', workspaceId]);
  }

  /**
   * Handle workspace creation
   */
  onCreateWorkspace(): void {
    // TODO: Open create workspace dialog
    console.log('Create workspace clicked');
    // For now, just log - the actual implementation would open a dialog
  }

  /**
   * Retry loading workspaces
   */
  onRetry(): void {
    const activeOwner = this.workspaceStore.activeOwner();
    if (activeOwner) {
      this.workspaceStore.connectOwnerSelection(activeOwner);
    }
  }

  /**
   * Get label for workspace owner type
   */
  getWorkspaceOwnerTypeLabel(ownerType: string): string {
    const labels: Record<string, string> = {
      user: 'Personal',
      organization: 'Organization',
    };
    return labels[ownerType] || ownerType;
  }

  /**
   * Get module count for workspace
   */
  getModuleCount(workspace: any): number {
    // TODO: Implement actual module count logic
    return 0;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }
}
