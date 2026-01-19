import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IdentitySwitcherComponent } from '../identity-switcher/identity-switcher.component';
import { WorkspaceSwitcherComponent } from '../workspace-switcher/workspace-switcher.component';
import { AuthStore } from '@application/stores/auth.store';

@Component({
  selector: 'app-top-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    IdentitySwitcherComponent,
    WorkspaceSwitcherComponent,
  ],
  templateUrl: './top-navigation.component.html',
  styleUrl: './top-navigation.component.scss',
})
export class TopNavigationComponent {
  private readonly authStore = inject(AuthStore);

  // Expose auth state
  protected readonly currentUser = this.authStore.currentUser;
  protected readonly isAuthenticated = this.authStore.isAuthenticated;

  /**
   * Handle identity change event from switcher
   */
  onIdentityChanged(event: any): void {
    console.log('Identity changed:', event);
    // The IdentityStore already handles the state update
    // Additional logic can be added here if needed
  }

  /**
   * Handle workspace change event from switcher
   */
  onWorkspaceChanged(event: any): void {
    console.log('Workspace changed:', event);
    // Additional logic can be added here if needed
    // e.g., navigate to workspace dashboard
  }

  /**
   * Get user avatar URL or initials
   */
  getUserAvatar(): string {
    const user = this.currentUser();
    if (!user) {
      return '';
    }

    // If user has a photoURL, use it
    if (user.photoURL) {
      return user.photoURL;
    }

    // Otherwise, return empty string to show initials
    return '';
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user?.displayName) {
      return '?';
    }

    const names = user.displayName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }

    return user.displayName.substring(0, 2).toUpperCase();
  }

  /**
   * Sign out the current user
   */
  signOut(): void {
    this.authStore.logout();
  }
}
