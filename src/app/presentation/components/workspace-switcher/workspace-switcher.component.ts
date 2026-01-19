import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { WorkspaceStore } from '@application/stores/workspace.store';
import type { Workspace } from '@domain/workspace/entities/workspace.entity';

export interface WorkspaceSelection {
  workspaceId: string;
  workspaceName: string;
}

interface GroupedWorkspace {
  workspace: Workspace;
  source: 'owned' | 'member' | 'team' | 'partner';
}

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.scss',
})
export class WorkspaceSwitcherComponent {
  private readonly workspaceStore = inject(WorkspaceStore);

  // Expose store state
  protected readonly workspaces = this.workspaceStore.workspaces;
  protected readonly loading = this.workspaceStore.loading;
  protected readonly activeOwner = this.workspaceStore.activeOwner;

  // Output event when workspace is changed
  workspaceChanged = output<WorkspaceSelection>();

  // Currently selected workspace ID
  selectedWorkspaceId: string | null = null;

  /**
   * Group workspaces by their source (owned, member, team, partner)
   */
  getGroupedWorkspaces(): {
    owned: Workspace[];
    member: Workspace[];
    team: Workspace[];
    partner: Workspace[];
  } {
    const owner = this.activeOwner();
    const workspaces = this.workspaces();

    const grouped = {
      owned: [] as Workspace[],
      member: [] as Workspace[],
      team: [] as Workspace[],
      partner: [] as Workspace[],
    };

    if (!owner) {
      return grouped;
    }

    // Group workspaces based on owner type
    for (const workspace of workspaces) {
      const workspaceOwner = workspace.owner;

      if (workspaceOwner.ownerId === owner.ownerId) {
        grouped.owned.push(workspace);
      } else if (owner.ownerType === 'team') {
        grouped.team.push(workspace);
      } else if (owner.ownerType === 'partner') {
        grouped.partner.push(workspace);
      } else {
        grouped.member.push(workspace);
      }
    }

    return grouped;
  }

  /**
   * Handle workspace selection change
   */
  onWorkspaceChange(workspaceId: string): void {
    const workspace = this.workspaces().find(
      (w) => w.id.value === workspaceId,
    );

    if (workspace) {
      this.selectedWorkspaceId = workspaceId;
      this.workspaceChanged.emit({
        workspaceId,
        workspaceName: workspace.name,
      });

      // Load modules for the selected workspace
      this.workspaceStore.loadModules(workspaceId);
    }
  }

  /**
   * Get status badge color based on workspace status
   */
  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'active':
        return 'primary';
      case 'archived':
        return 'accent';
      case 'deleted':
        return 'warn';
      default:
        return 'primary';
    }
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Check if there are any workspaces available
   */
  hasWorkspaces(): boolean {
    return this.workspaces().length > 0;
  }
}
