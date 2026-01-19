import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

/**
 * Module Host Component
 *
 * Placeholder component that displays the current workspace module.
 * Future: Will dynamically load module-specific components based on route.
 *
 * Architecture:
 * - Presentation layer (zone-less, standalone)
 * - Pure display component
 * - No business logic
 */
@Component({
  selector: 'app-module-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-host">
      <div class="module-placeholder">
        <h2>Module Host</h2>
        @if (workspaceId(); as wsId) {
          <p>Workspace ID: <code>{{ wsId }}</code></p>
        }
        @if (moduleKey(); as modKey) {
          <p>Module: <code>{{ modKey }}</code></p>
        }
        <p class="info">
          Module-specific content will be dynamically loaded here.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .module-host {
        padding: 24px;

        .module-placeholder {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          padding: 48px 24px;
          background: var(--mat-sys-surface, #ffffff);
          border-radius: var(--mat-sys-corner-large, 16px);
          box-shadow: var(--mat-sys-level1);

          h2 {
            font: var(--mat-sys-headline-medium);
            color: var(--mat-sys-on-surface, #1c1b1f);
            margin: 0 0 16px 0;
          }

          p {
            font: var(--mat-sys-body-medium);
            color: var(--mat-sys-on-surface-variant, #49454f);
            margin: 8px 0;

            code {
              padding: 2px 8px;
              background: var(--mat-sys-surface-variant, #e7e0ec);
              color: var(--mat-sys-on-surface-variant, #49454f);
              border-radius: var(--mat-sys-corner-extra-small, 4px);
              font-family: 'Courier New', monospace;
            }
          }

          .info {
            margin-top: 24px;
            font-style: italic;
            color: var(--mat-sys-outline, #79747e);
          }
        }
      }
    `,
  ],
})
export class ModuleHostComponent {
  private readonly route = inject(ActivatedRoute);

  // Extract workspace ID from parent route
  readonly workspaceId = toSignal(
    this.route.parent?.paramMap.pipe(map((params) => params.get('id'))) ?? [],
    { initialValue: null },
  );

  // Extract module key from current route
  readonly moduleKey = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('module'))),
    { initialValue: null },
  );
}
