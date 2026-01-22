import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthSessionFacade } from '@application/facades/auth-session.facade';

/**
 * Auth Demo Section Component
 * 
 * Extracted from home-page: authentication form section
 * 
 * Architecture Compliance:
 * - Standalone component (Angular 20)
 * - Injects facade only
 * - Uses Angular 20 control flow (@if/@for)
 * - OnPush change detection
 * - NO business logic
 * 
 * DDD Layer: Presentation
 * Dependencies: Application layer (facade only)
 */
@Component({
  selector: 'app-auth-demo-section',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="auth-demo-section">
      <mat-card-header>
        <mat-card-title>Authentication Demo</mat-card-title>
        <mat-card-subtitle>Session management</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (facade.user(); as user) {
          <div class="auth-info">
            <p class="auth-status">✓ Authenticated</p>
            <p class="auth-email">{{ user.email }}</p>
          </div>
        } @else {
          <p class="auth-status">Not authenticated</p>
        }
      </mat-card-content>
      <mat-card-actions align="end">
        @if (facade.isAuthenticated()) {
          <button
            mat-stroked-button
            type="button"
            (click)="onSignOut()"
            [disabled]="facade.loading()"
          >
            Sign out
          </button>
        } @else {
          <a mat-raised-button color="primary" href="/auth/signin">
            Sign in
          </a>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .auth-demo-section {
        height: 100%;
      }

      .auth-info {
        display: grid;
        gap: 8px;
      }

      .auth-status {
        margin: 0;
        font: var(--mat-sys-title-medium);
        color: var(--mat-sys-primary, #1976d2);
      }

      .auth-email {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant, #4b5563);
      }
    `,
  ],
})
export class AuthDemoSectionComponent {
  readonly facade = inject(AuthSessionFacade);

  onSignOut(): void {
    this.facade.signOut();
  }
}
