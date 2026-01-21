import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Error Display Component - Dumb Component
 * 
 * Purpose:
 * - Consistent error presentation across the app
 * - Allows retry action
 * - Pure presentation component
 * 
 * DDD Architecture:
 * - Dumb component (no business logic)
 * - Input/Output communication
 * - Fully reusable
 */
@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="error-card">
      <mat-card-content class="error-content">
        <mat-icon color="warn" class="error-icon">error</mat-icon>
        <h2 class="error-title">{{ title() }}</h2>
        <p class="error-message">{{ message() }}</p>
        @if (showRetry()) {
          <button
            mat-raised-button
            type="button"
            (click)="retry.emit()"
          >
            Retry
          </button>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .error-card {
        max-width: 600px;
        margin: 0 auto;
      }

      .error-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        text-align: center;
      }

      .error-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      .error-title {
        margin: 0 0 8px 0;
        font: var(--mat-sys-headline-small);
      }

      .error-message {
        margin: 0 0 24px 0;
        font: var(--mat-sys-body-large);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
})
export class ErrorDisplayComponent {
  readonly title = input('Something went wrong');
  readonly message = input<string>('An unexpected error occurred.');
  readonly showRetry = input(true);
  readonly retry = output<void>();
}
