import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field appearance="outline" class="workspace-selector">
      <mat-label>Workspace</mat-label>
      <mat-icon matPrefix>workspace_premium</mat-icon>
      <mat-select
        [value]="selectedWorkspaceId()"
        (selectionChange)="onWorkspaceChange($event.value)"
        placeholder="Select workspace"
      >
        @if (groupedWorkspaces().owned.length > 0) {
          <mat-optgroup label="Owned">
            @for (item of groupedWorkspaces().owned; track item.workspace.id) {
              <mat-option [value]="item.workspace.id">
                <div class="workspace-option">
                  <span class="workspace-name">{{ item.workspace.name }}</span>
                  <span
                    class="workspace-status"
                    [class.active]="item.workspace.status === 'active'"
                    [class.archived]="item.workspace.status === 'archived'"
                  >
                    {{ item.workspace.status }}
                  </span>
                </div>
              </mat-option>
            }
          </mat-optgroup>
        }

        @if (groupedWorkspaces().member.length > 0) {
          <mat-optgroup label="Member">
            @for (item of groupedWorkspaces().member; track item.workspace.id) {
              <mat-option [value]="item.workspace.id">
                <div class="workspace-option">
                  <span class="workspace-name">{{ item.workspace.name }}</span>
                  <span
                    class="workspace-status"
                    [class.active]="item.workspace.status === 'active'"
                    [class.archived]="item.workspace.status === 'archived'"
                  >
                    {{ item.workspace.status }}
                  </span>
                </div>
              </mat-option>
            }
          </mat-optgroup>
        }

        @if (groupedWorkspaces().team.length > 0) {
          <mat-optgroup label="Team">
            @for (item of groupedWorkspaces().team; track item.workspace.id) {
              <mat-option [value]="item.workspace.id">
                <div class="workspace-option">
                  <span class="workspace-name">{{ item.workspace.name }}</span>
                  <span
                    class="workspace-status"
                    [class.active]="item.workspace.status === 'active'"
                    [class.archived]="item.workspace.status === 'archived'"
                  >
                    {{ item.workspace.status }}
                  </span>
                </div>
              </mat-option>
            }
          </mat-optgroup>
        }

        @if (groupedWorkspaces().partner.length > 0) {
          <mat-optgroup label="Partner">
            @for (
              item of groupedWorkspaces().partner;
              track item.workspace.id
            ) {
              <mat-option [value]="item.workspace.id">
                <div class="workspace-option">
                  <span class="workspace-name">{{ item.workspace.name }}</span>
                  <span
                    class="workspace-status"
                    [class.active]="item.workspace.status === 'active'"
                    [class.archived]="item.workspace.status === 'archived'"
                  >
                    {{ item.workspace.status }}
                  </span>
                </div>
              </mat-option>
            }
          </mat-optgroup>
        }

        @if (workspaceStore.workspaceCount() === 0) {
          <mat-option disabled>No workspaces available</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [
    `
      .workspace-selector {
        min-width: 250px;

        @media (max-width: 768px) {
          min-width: 150px;
        }
      }

      .workspace-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        .workspace-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .workspace-status {
          font: var(--mat-sys-label-small);
          padding: 2px 8px;
          border-radius: var(--mat-sys-corner-small, 4px);
          text-transform: uppercase;

          &.active {
            background: var(--mat-sys-tertiary-container, #d0e4ff);
            color: var(--mat-sys-on-tertiary-container, #001d35);
          }

          &.archived {
            background: var(--mat-sys-surface-variant, #e7e0ec);
            color: var(--mat-sys-on-surface-variant, #49454f);
          }
        }
      }
    `,
  ],
})
export class WorkspaceSwitcherComponent {
  readonly workspaceStore = inject(WorkspaceStore);

  readonly workspaceChanged = output<WorkspaceSelection>();

  // Track selected workspace (could be from router or state)
  selectedWorkspaceId = computed(() => {
    // For now, return first workspace if available
    const workspaces = this.workspaceStore.workspaces();
    return workspaces.length > 0 ? workspaces[0].id : null;
  });

  // Group workspaces by source type
  groupedWorkspaces = computed(() => {
    const workspaces = this.workspaceStore.workspaces();
    const activeOwner = this.workspaceStore.activeOwner();

    const groups: Record<
      'owned' | 'member' | 'team' | 'partner',
      GroupedWorkspace[]
    > = {
      owned: [],
      member: [],
      team: [],
      partner: [],
    };

    if (!activeOwner) {
      return groups;
    }

    // Categorize workspaces based on owner type
    for (const workspace of workspaces) {
      const item: GroupedWorkspace = {
        workspace,
        source: this.getWorkspaceSource(workspace, activeOwner),
      };

      groups[item.source].push(item);
    }

    return groups;
  });

  onWorkspaceChange(workspaceId: string): void {
    const workspace = this.workspaceStore
      .workspaces()
      .find((w) => w.id === workspaceId);

    if (workspace) {
      this.workspaceChanged.emit({
        workspaceId: workspace.id,
        workspaceName: workspace.name,
      });
    }
  }

  private getWorkspaceSource(
    workspace: Workspace,
    activeOwner: { ownerId: string; ownerType: string },
  ): 'owned' | 'member' | 'team' | 'partner' {
    // Determine workspace source based on owner type
    if (
      workspace.owner.ownerId === activeOwner.ownerId &&
      workspace.owner.ownerType === activeOwner.ownerType
    ) {
      return 'owned';
    }

    switch (activeOwner.ownerType) {
      case 'team':
        return 'team';
      case 'partner':
        return 'partner';
      default:
        return 'member';
    }
  }
}
