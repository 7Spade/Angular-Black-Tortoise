import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { IdentityStore } from '@application/stores/identity.store';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

@Component({
  selector: 'app-identity-switcher',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './identity-switcher.component.html',
  styleUrl: './identity-switcher.component.scss',
})
export class IdentitySwitcherComponent {
  readonly identityStore = inject(IdentityStore);
  readonly identityChanged = output<{
    ownerType: WorkspaceOwnerType;
    ownerId: string;
  }>();

  onSelectIdentity(ownerType: WorkspaceOwnerType, ownerId: string): void {
    this.identityStore.selectWorkspaceOwner(ownerType, ownerId);
    this.identityChanged.emit({ ownerType, ownerId });
  }

  getActiveIdentityDisplay(): string {
    const active = this.identityStore.activeWorkspaceOwner();
    if (!active) {
      return 'Select Identity';
    }

    if (active.ownerType === 'user') {
      const user = this.identityStore
        .users()
        .find((u) => u.id.getValue() === active.ownerId);
      return user ? 'Personal' : 'User';
    }

    if (active.ownerType === 'organization') {
      return 'Organization';
    }

    if (active.ownerType === 'bot') {
      return 'Bot';
    }

    return 'Unknown';
  }
}
