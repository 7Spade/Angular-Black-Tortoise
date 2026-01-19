import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
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
   * Select a team within an organization
   */
  selectTeam(teamId: string, teamName: string): void {
    const selection: IdentitySelection = {
      ownerId: teamId,
      ownerType: 'team',
      displayName: teamName,
    };
    this.identityStore.selectWorkspaceOwner('team', teamId);
    this.identityChanged.emit(selection);
  }

  /**
   * Select a partner
   */
  selectPartner(partnerId: string, partnerName: string): void {
    const selection: IdentitySelection = {
      ownerId: partnerId,
      ownerType: 'partner',
      displayName: partnerName,
    };
    this.identityStore.selectWorkspaceOwner('partner', partnerId);
    this.identityChanged.emit(selection);
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
    switch (owner.ownerType) {
      case 'user': {
        const user = this.users().find((u) => u.id.value === owner.ownerId);
        return user?.displayName ?? 'User';
      }
      case 'organization': {
        const org = this.organizations().find(
          (o) => o.id.value === owner.ownerId,
        );
        return org?.name ?? 'Organization';
      }
      case 'team': {
        const team = this.teams().find((t) => t.id.value === owner.ownerId);
        return team?.name ?? 'Team';
      }
      case 'partner': {
        const partner = this.partners().find(
          (p) => p.id.value === owner.ownerId,
        );
        return partner?.name ?? 'Partner';
      }
      default:
        return 'Select Identity';
    }
  }
}
