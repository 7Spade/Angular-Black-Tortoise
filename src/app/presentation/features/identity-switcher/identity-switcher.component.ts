import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { IdentityStore } from '@application/stores/identity.store';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

/**
 * Identity Switcher Component (Account Switcher)
 * Allows switching between User/Organization identities and selecting Team/Partner contexts
 * 
 * Presentation Layer - UI Component
 * - Follows Material Design 3 specifications
 * - Connects to IdentityStore for state management
 * - Keyboard shortcut: Ctrl/Cmd + Shift + A (future enhancement)
 */
@Component({
  selector: 'app-identity-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './identity-switcher.component.html',
  styleUrls: ['./identity-switcher.component.css'],
})
export class IdentitySwitcherComponent {
  private readonly identityStore = inject(IdentityStore);

  // Expose store signals to template
  readonly users = this.identityStore.users;
  readonly organizations = this.identityStore.organizations;
  readonly teams = this.identityStore.teams;
  readonly partners = this.identityStore.partners;
  readonly activeWorkspaceOwner = this.identityStore.activeWorkspaceOwner;

  // Computed signals for UI logic
  readonly currentIdentity = computed(() => {
    const active = this.activeWorkspaceOwner();
    if (!active) return null;

    if (active.ownerType === 'user') {
      return this.users().find((u) => u.id.value === active.ownerId);
    } else if (active.ownerType === 'organization') {
      return this.organizations().find((o) => o.id.value === active.ownerId);
    }
    return null;
  });

  readonly currentIdentityType = computed(
    () => this.activeWorkspaceOwner()?.ownerType ?? null,
  );

  readonly isOrganizationContext = computed(
    () => this.currentIdentityType() === 'organization',
  );

  readonly currentOrganizationId = computed(() => {
    const active = this.activeWorkspaceOwner();
    return active?.ownerType === 'organization' ? active.ownerId : null;
  });

  /**
   * Switch to a different identity (User or Organization)
   */
  switchIdentity(ownerType: WorkspaceOwnerType, ownerId: string): void {
    this.identityStore.selectWorkspaceOwner(ownerType, ownerId);
  }

  /**
   * Select a Team context (does not change login identity)
   */
  selectTeamContext(teamId: string): void {
    // Team selection is context-only, maintains Organization identity
    // Future: emit team context selection event
    console.log('Team context selected:', teamId);
  }

  /**
   * Select a Partner context (does not change login identity)
   */
  selectPartnerContext(partnerId: string): void {
    // Partner selection is context-only, maintains Organization identity
    // Future: emit partner context selection event
    console.log('Partner context selected:', partnerId);
  }

  /**
   * Get display name for current identity
   */
  getCurrentDisplayName(): string {
    const identity = this.currentIdentity();
    if (!identity) return 'Select Account';
    
    // Domain entities are minimal - display name should come from
    // presentation layer or DTO mapping (not stored in domain entity)
    return identity.id.value.substring(0, 8); // Temporary: show ID prefix
  }

  /**
   * Load users on init if not already loaded
   */
  ngOnInit(): void {
    if (this.users().length === 0) {
      this.identityStore.loadUsers();
    }
    if (this.organizations().length === 0) {
      this.identityStore.loadOrganizations();
    }
  }
}
