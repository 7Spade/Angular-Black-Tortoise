import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { IdentityStore } from '@application/stores/identity.store';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

export interface IdentitySelection {
  ownerId: string;
  ownerType: WorkspaceOwnerType;
  displayName: string;
}

@Component({
  selector: 'app-identity-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './identity-switcher.component.html',
  styleUrl: './identity-switcher.component.scss',
})
export class IdentitySwitcherComponent {
  private readonly identityStore = inject(IdentityStore);

  // Expose store state
  protected readonly users = this.identityStore.users;
  protected readonly organizations = this.identityStore.organizations;
  protected readonly bots = this.identityStore.bots;
  protected readonly teams = this.identityStore.teams;
  protected readonly partners = this.identityStore.partners;
  protected readonly activeOwner = this.identityStore.activeWorkspaceOwner;

  // Output event when identity is changed
  identityChanged = output<IdentitySelection>();

  /**
   * Select a user as the active identity
   */
  selectUser(userId: string, displayName: string): void {
    const selection: IdentitySelection = {
      ownerId: userId,
      ownerType: 'user',
      displayName,
    };
    this.identityStore.selectWorkspaceOwner('user', userId);
    this.identityChanged.emit(selection);
  }

  /**
   * Select an organization as the active identity
   */
  selectOrganization(orgId: string, orgName: string): void {
    const selection: IdentitySelection = {
      ownerId: orgId,
      ownerType: 'organization',
      displayName: orgName,
    };
    this.identityStore.selectWorkspaceOwner('organization', orgId);
    this.identityChanged.emit(selection);

    // Load teams and partners for this organization
    this.identityStore.loadTeams(orgId);
    this.identityStore.loadPartners(orgId);
  }

  /**
   * Get the display name for the currently active identity
   */
  getActiveDisplayName(): string {
    const owner = this.activeOwner();
    if (!owner) {
      return 'Select Identity';
    }

    // Find the display name based on owner type
    // Only user and organization are valid workspace owners
    switch (owner.ownerType) {
      case 'user': {
        const user = this.users().find((u) => u.id.getValue() === owner.ownerId);
        return user?.displayName.getValue() ?? 'User';
      }
      case 'organization': {
        const org = this.organizations().find(
          (o) => o.id.getValue() === owner.ownerId,
        );
        return org?.name.getValue() ?? 'Organization';
      }
      default:
        return 'Select Identity';
    }
  }
}
