import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
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
    MatDividerModule,
    IdentitySwitcherComponent,
    WorkspaceSwitcherComponent,
  ],
  templateUrl: './top-navigation.component.html',
  styleUrl: './top-navigation.component.scss',
})
export class TopNavigationComponent {
  readonly identityStore = inject(IdentityStore);

  getUserInitials(): string {
    const user = this.identityStore.currentUser();
    if (!user) {
      return '?';
    }

    const displayName = user.displayName || user.email;
    const parts = displayName.split(' ');

    if (parts.length >= 2) {
      const first = parts[0]?.[0];
      const second = parts[1]?.[0];
      if (first && second) {
        return (first + second).toUpperCase();
      }
    }

    return displayName.slice(0, 2).toUpperCase();
  }

  getUserDisplayName(): string {
    const user = this.identityStore.currentUser();
    if (!user) {
      return 'Guest';
    }

    return user.displayName || user.email;
  }
}
