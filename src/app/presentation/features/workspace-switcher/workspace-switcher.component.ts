import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkspaceStore } from '@application/stores/workspace.store';
import { IdentityStore } from '@application/stores/identity.store';

/**
 * Workspace Switcher Component
 * Allows switching between workspaces owned by the current identity
 * 
 * Presentation Layer - UI Component
 * - Follows Material Design 3 specifications
 * - Connects to WorkspaceStore and IdentityStore for state management
 * - Keyboard shortcut: Ctrl/Cmd + K (future enhancement)
 */
@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrls: ['./workspace-switcher.component.css'],
})
export class WorkspaceSwitcherComponent {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly identityStore = inject(IdentityStore);

  // Local search state
  readonly searchQuery = signal('');

  // Expose store signals to template
  readonly workspaces = this.workspaceStore.workspaces;
  readonly activeOwner = this.workspaceStore.activeOwner;
  readonly loading = this.workspaceStore.loading;

  readonly currentIdentityType = computed(
    () => this.activeOwner()?.ownerType ?? null,
  );

  // Filtered workspaces based on search query
  readonly filteredWorkspaces = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allWorkspaces = this.workspaces();

    if (!query) {
      return allWorkspaces;
    }

    return allWorkspaces.filter((ws) =>
      ws.id.value.toLowerCase().includes(query),
    );
  });

  // Group workspaces by category (for future enhancement)
  readonly recentWorkspaces = computed(() => {
    // Future: implement recent workspaces tracking
    return this.filteredWorkspaces().slice(0, 3);
  });

  readonly allOwnedWorkspaces = computed(() => {
    return this.filteredWorkspaces();
  });

  /**
   * Get current workspace display name
   */
  getCurrentWorkspaceName(): string {
    const workspaces = this.workspaces();
    if (workspaces.length === 0) {
      return 'No Workspace';
    }
    // Default to first workspace (future: track active workspace)
    return workspaces[0].id.value.substring(0, 12);
  }

  /**
   * Switch to a different workspace
   */
  switchWorkspace(workspaceId: string): void {
    // Future: implement workspace switching logic
    console.log('Switch to workspace:', workspaceId);
  }

  /**
   * Create new workspace
   */
  createWorkspace(): void {
    // Future: open create workspace dialog
    console.log(
      'Create workspace for identity type:',
      this.currentIdentityType(),
    );
  }

  /**
   * Clear search query
   */
  clearSearch(): void {
    this.searchQuery.set('');
  }
}
