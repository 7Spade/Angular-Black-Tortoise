import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IdentitySwitcherComponent } from '../identity-switcher/identity-switcher.component';
import { WorkspaceSwitcherComponent } from '../workspace-switcher/workspace-switcher.component';
import { IdentityStore } from '@application/stores/identity.store';

@Component({
  selector: 'app-top-navigation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    IdentitySwitcherComponent,
    WorkspaceSwitcherComponent,
  ],
  templateUrl: './top-navigation.component.html',
  styleUrl: './top-navigation.component.scss',
})
export class TopNavigationComponent {
  readonly identityStore = inject(IdentityStore);

  getUserInitials(): string {
    const users = this.identityStore.users();
    if (users.length === 0) {
      return '?';
    }

    const user = users[0];
    const displayName = user.displayName?.getValue() || user.email.getValue();
    const parts = displayName.split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return displayName.slice(0, 2).toUpperCase();
  }

  getUserDisplayName(): string {
    const users = this.identityStore.users();
    if (users.length === 0) {
      return 'Guest';
    }

    const user = users[0];
    return user.displayName?.getValue() || user.email.getValue();
  }
}
