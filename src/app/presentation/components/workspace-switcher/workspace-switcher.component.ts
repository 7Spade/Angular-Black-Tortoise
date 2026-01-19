import { Component, inject, output, computed } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { WorkspaceStore } from '@application/stores/workspace.store';
import type { Workspace } from '@domain/workspace/entities/workspace.entity';

interface WorkspaceGroup {
  label: string;
  icon: string;
  workspaces: Workspace[];
}

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.scss',
})
export class WorkspaceSwitcherComponent {
  readonly workspaceStore = inject(WorkspaceStore);
  readonly workspaceChanged = output<string>();

  // Group workspaces by source
  readonly workspaceGroups = computed<WorkspaceGroup[]>(() => {
    const allWorkspaces = this.workspaceStore.workspaces();
    const currentOwner = this.workspaceStore.currentWorkspaceOwner();

    if (!currentOwner) {
      return [];
    }

    const groups: WorkspaceGroup[] = [];

    // Owned workspaces (where user is the owner)
    const owned = allWorkspaces.filter(
      (w) =>
        w.owner.ownerId === currentOwner.ownerId &&
        w.owner.ownerType === currentOwner.ownerType
    );

    if (owned.length > 0) {
      groups.push({
        label: 'Owned',
        icon: 'person',
        workspaces: owned,
      });
    }

    // Member workspaces (where user is a member but not owner)
    const member = allWorkspaces.filter(
      (w) =>
        !(
          w.owner.ownerId === currentOwner.ownerId &&
          w.owner.ownerType === currentOwner.ownerType
        ) && w.owner.ownerType === 'organization'
    );

    if (member.length > 0) {
      groups.push({
        label: 'Member',
        icon: 'group',
        workspaces: member,
      });
    }

    // Team workspaces
    const team = allWorkspaces.filter((w) => w.owner.ownerType === 'team');

    if (team.length > 0) {
      groups.push({
        label: 'Team',
        icon: 'groups',
        workspaces: team,
      });
    }

    // Partner workspaces
    const partner = allWorkspaces.filter(
      (w) => w.owner.ownerType === 'partner'
    );

    if (partner.length > 0) {
      groups.push({
        label: 'Partner',
        icon: 'handshake',
        workspaces: partner,
      });
    }

    return groups;
  });

  onWorkspaceChange(workspaceId: string): void {
    this.workspaceStore.selectWorkspace(workspaceId);
    this.workspaceChanged.emit(workspaceId);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'archived':
        return 'accent';
      case 'deleted':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'archived':
        return 'Archived';
      case 'deleted':
        return 'Deleted';
      default:
        return status;
    }
  }
}
