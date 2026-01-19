import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
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
  imports: [MatButtonModule, MatIconModule, MatListModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-stroked-button
      type="button"
      [matMenuTriggerFor]="identityMenu"
      class="identity-trigger"
    >
      <mat-icon>account_circle</mat-icon>
      @if (identityStore.activeWorkspaceOwner(); as owner) {
        <span class="identity-label">{{ getDisplayName(owner) }}</span>
      } @else {
        <span class="identity-label">Select Identity</span>
      }
      <mat-icon>arrow_drop_down</mat-icon>
    </button>

    <mat-menu #identityMenu="matMenu" class="identity-menu">
      <!-- Users Section -->
      @if (identityStore.users().length > 0) {
        <div class="menu-section">
          <div class="section-header">Personal</div>
          @for (user of identityStore.users(); track user.id) {
            <button
              mat-menu-item
              type="button"
              (click)="selectIdentity('user', user.id, user.displayName)"
              [class.active]="isActive('user', user.id)"
            >
              <mat-icon>person</mat-icon>
              <span>{{ user.displayName }}</span>
              @if (isActive('user', user.id)) {
                <mat-icon class="check-icon">check</mat-icon>
              }
            </button>
          }
        </div>
      }

      <!-- Organizations Section -->
      @if (identityStore.organizations().length > 0) {
        <div class="menu-section">
          <div class="section-header">Organizations</div>
          @for (org of identityStore.organizations(); track org.id) {
            <button
              mat-menu-item
              type="button"
              (click)="selectIdentity('organization', org.id, org.name)"
              [class.active]="isActive('organization', org.id)"
            >
              <mat-icon>business</mat-icon>
              <span>{{ org.name }}</span>
              @if (isActive('organization', org.id)) {
                <mat-icon class="check-icon">check</mat-icon>
              }
            </button>

            <!-- Teams under Organization -->
            @if (shouldShowTeams(org.id)) {
              <div class="subsection">
                @for (team of identityStore.teams(); track team.id) {
                  <button
                    mat-menu-item
                    type="button"
                    (click)="selectIdentity('team', team.id, team.name)"
                    [class.active]="isActive('team', team.id)"
                  >
                    <mat-icon>group</mat-icon>
                    <span>{{ team.name }}</span>
                    @if (isActive('team', team.id)) {
                      <mat-icon class="check-icon">check</mat-icon>
                    }
                  </button>
                }
              </div>
            }

            <!-- Partners under Organization -->
            @if (shouldShowPartners(org.id)) {
              <div class="subsection">
                @for (partner of identityStore.partners(); track partner.id) {
                  <button
                    mat-menu-item
                    type="button"
                    (click)="
                      selectIdentity('partner', partner.id, partner.name)
                    "
                    [class.active]="isActive('partner', partner.id)"
                  >
                    <mat-icon>handshake</mat-icon>
                    <span>{{ partner.name }}</span>
                    @if (isActive('partner', partner.id)) {
                      <mat-icon class="check-icon">check</mat-icon>
                    }
                  </button>
                }
              </div>
            }
          }
        </div>
      }

      <!-- Bots Section -->
      @if (identityStore.bots().length > 0) {
        <div class="menu-section">
          <div class="section-header">Bots</div>
          @for (bot of identityStore.bots(); track bot.id) {
            <button
              mat-menu-item
              type="button"
              (click)="selectIdentity('bot', bot.id, bot.name)"
              [class.active]="isActive('bot', bot.id)"
            >
              <mat-icon>smart_toy</mat-icon>
              <span>{{ bot.name }}</span>
              @if (isActive('bot', bot.id)) {
                <mat-icon class="check-icon">check</mat-icon>
              }
            </button>
          }
        </div>
      }
    </mat-menu>
  `,
  styles: [
    `
      .identity-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 200px;

        .identity-label {
          flex: 1;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          min-width: auto;

          .identity-label {
            display: none;
          }
        }
      }

      .menu-section {
        padding: 8px 0;

        &:not(:last-child) {
          border-bottom: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
        }
      }

      .section-header {
        padding: 8px 16px;
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
        text-transform: uppercase;
      }

      .subsection {
        padding-left: 16px;
        background: var(--mat-sys-surface-container, #f5f5f5);

        button {
          font-size: 0.9em;
        }
      }

      button[mat-menu-item] {
        display: flex;
        align-items: center;
        gap: 12px;

        &.active {
          background: var(--mat-sys-secondary-container, #e8def8);
          color: var(--mat-sys-on-secondary-container, #1d192b);
        }

        .check-icon {
          margin-left: auto;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    `,
  ],
})
export class IdentitySwitcherComponent {
  readonly identityStore = inject(IdentityStore);

  readonly identityChanged = output<IdentitySelection>();

  selectIdentity(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
    displayName: string,
  ): void {
    this.identityStore.selectWorkspaceOwner(ownerType, ownerId);
    this.identityChanged.emit({ ownerId, ownerType, displayName });
  }

  isActive(ownerType: WorkspaceOwnerType, ownerId: string): boolean {
    const active = this.identityStore.activeWorkspaceOwner();
    return (
      active !== null &&
      active.ownerType === ownerType &&
      active.ownerId === ownerId
    );
  }

  getDisplayName(owner: {
    ownerId: string;
    ownerType: WorkspaceOwnerType;
  }): string {
    switch (owner.ownerType) {
      case 'user':
        return (
          this.identityStore
            .users()
            .find((u) => u.id === owner.ownerId)?.displayName || 'User'
        );
      case 'organization':
        return (
          this.identityStore
            .organizations()
            .find((o) => o.id === owner.ownerId)?.name || 'Organization'
        );
      case 'team':
        return (
          this.identityStore.teams().find((t) => t.id === owner.ownerId)
            ?.name || 'Team'
        );
      case 'partner':
        return (
          this.identityStore
            .partners()
            .find((p) => p.id === owner.ownerId)?.name || 'Partner'
        );
      case 'bot':
        return (
          this.identityStore.bots().find((b) => b.id === owner.ownerId)?.name ||
          'Bot'
        );
      default:
        return 'Unknown';
    }
  }

  shouldShowTeams(organizationId: string): boolean {
    // Only show teams for the selected organization
    const active = this.identityStore.activeWorkspaceOwner();
    return (
      active !== null &&
      active.ownerType === 'organization' &&
      active.ownerId === organizationId
    );
  }

  shouldShowPartners(organizationId: string): boolean {
    // Only show partners for the selected organization
    const active = this.identityStore.activeWorkspaceOwner();
    return (
      active !== null &&
      active.ownerType === 'organization' &&
      active.ownerId === organizationId
    );
  }
}
