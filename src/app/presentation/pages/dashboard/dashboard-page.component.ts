import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

/**
 * Dashboard Page Component
 * 
 * Architecture Compliance:
 * - Component uses AuthSessionFacade (not AuthStore)
 * - Calls facade methods for actions
 * - Reads facade signals for UI state
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dashboard-shell">
      <mat-card class="dashboard-card">
        <mat-card-header>
          <mat-card-title>Welcome back</mat-card-title>
          <mat-card-subtitle>Authenticated workspace</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (facade.user(); as user) {
            <p class="dashboard-text">Signed in as {{ user.email }}</p>
          } @else {
            <p class="dashboard-text">Preparing your session...</p>
          }
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            mat-stroked-button
            type="button"
            (click)="onSignOut()"
            [disabled]="facade.loading()"
          >
            Sign out
          </button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .dashboard-shell {
        display: grid;
        place-items: center;
        min-height: 100vh;
        padding: 24px;
        background: var(--mat-sys-surface, #fafafa);
      }

      .dashboard-card {
        width: min(520px, 100%);
      }

      .dashboard-text {
        font: var(--mat-sys-body-large);
      }
    `,
  ],
})
export class DashboardPageComponent {
  readonly facade = inject(AuthSessionFacade);

  onSignOut(): void {
    this.facade.signOut();
  }
}
