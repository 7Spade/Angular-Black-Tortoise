import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AcceptanceContainerComponent } from './acceptance-container.component';

/**
 * Acceptance Entry Component
 * 
 * Architecture Compliance:
 * - Entry point for the acceptance feature
 * - Standalone component (Angular 20)
 * - Handles layout and guard decisions
 * - Routes point to this component
 * - Delegates to container components
 * - Uses Angular 20 control flow (@if/@for)
 * 
 * Responsibilities:
 * 1. Act as the entry point for acceptance routing
 * 2. Determine which layout to use (if applicable)
 * 3. Handle feature-level guards (when implemented)
 * 4. Compose container components
 * 
 * Routing:
 * - Routes should point to this component
 * - This component decides what to render
 * - Clean separation: entry → container → facade
 * 
 * DDD Layer: Presentation (Features)
 * Dependencies: None (pure composition)
 */
@Component({
  selector: 'app-acceptance-entry',
  standalone: true,
  imports: [AcceptanceContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="acceptance-entry">
      <!-- 
        Future: Could add layout selection logic here
        Future: Could add feature-level guards/loading states
        For now: Direct composition of container
      -->
      <app-acceptance-container />
    </div>
  `,
  styles: [
    `
      .acceptance-entry {
        min-height: 100vh;
        background: var(--mat-sys-background, #fafafa);
      }
    `,
  ],
})
export class AcceptanceEntryComponent {
  /**
   * No logic needed - pure composition
   * Future: Add layout/guard logic here if needed
   */
}
