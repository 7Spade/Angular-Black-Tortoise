import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Loading Spinner Component - Dumb Component
 * 
 * Purpose:
 * - Consistent loading indicator across the app
 * - Configurable size and message
 * - Pure presentation component
 * 
 * DDD Architecture:
 * - Dumb component (no business logic)
 * - Input-only communication
 * - Fully reusable
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-container">
      <mat-spinner [diameter]="diameter()" />
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        gap: 16px;
      }

      .loading-message {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  readonly diameter = input(48);
  readonly message = input<string | null>(null);
}
