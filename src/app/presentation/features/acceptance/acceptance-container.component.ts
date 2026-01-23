import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AcceptanceFacade } from '@application/facades/acceptance.facade';

/**
 * Acceptance Container Component
 * 
 * Architecture Compliance:
 * - Standalone component (Angular 20)
 * - Injects facade only (not stores/use cases/services)
 * - Uses signals for reactive state
 * - Uses Angular 20 control flow (@if/@for/@switch)
 * - OnPush change detection (signal-driven)
 * - NO business logic (delegates to facade)
 * - NO direct repository/infrastructure access
 * 
 * Responsibilities:
 * 1. Display acceptance items
 * 2. Handle user interactions
 * 3. Delegate actions to facade
 * 4. Present reactive state from facade signals
 * 
 * DDD Layer: Presentation
 * Dependencies: Application layer (facade only)
 */
@Component({
  selector: 'app-acceptance-container',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="acceptance-container">
      <mat-card class="acceptance-header">
        <mat-card-header>
          <mat-card-title>Acceptance Management</mat-card-title>
          <mat-card-subtitle>
            Review and approve items
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="acceptance-stats">
            <p class="stat-item">
              Total: {{ facade.itemCount() }}
            </p>
            <p class="stat-item">
              Pending: {{ facade.pendingItems().length }}
            </p>
            <p class="stat-item">
              Approved: {{ facade.approvedItems().length }}
            </p>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            mat-stroked-button
            type="button"
            (click)="onRefresh()"
            [disabled]="facade.loading()"
          >
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </mat-card-actions>
      </mat-card>

      @if (facade.loading()) {
        <div class="acceptance-loading">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Loading acceptance items...</p>
        </div>
      }

      @if (facade.error(); as error) {
        <mat-card class="acceptance-error" appearance="outlined">
          <mat-card-content>
            <div class="error-content">
              <mat-icon color="warn">error</mat-icon>
              <p>{{ error }}</p>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button
              mat-button
              type="button"
              (click)="facade.clearError()"
            >
              Dismiss
            </button>
          </mat-card-actions>
        </mat-card>
      }

      @if (!facade.loading() && !facade.hasItems()) {
        <mat-card class="acceptance-empty">
          <mat-card-content>
            <mat-icon>inbox</mat-icon>
            <p>No acceptance items found</p>
          </mat-card-content>
        </mat-card>
      }

      @if (facade.hasItems()) {
        <div class="acceptance-list">
          @for (item of facade.items(); track item.id) {
            <mat-card 
              class="acceptance-item"
              [class.selected]="item.id === facade.selectedItemId()"
            >
              <mat-card-header>
                <mat-card-title>{{ item.title }}</mat-card-title>
                <mat-card-subtitle>
                  {{ item.status | uppercase }} • {{ item.createdBy }}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{ item.description }}</p>
              </mat-card-content>
              <mat-card-actions align="end">
                <button
                  mat-button
                  type="button"
                  (click)="onSelectItem(item.id)"
                >
                  View
                </button>
                @if (item.status === 'pending') {
                  <button
                    mat-raised-button
                    color="primary"
                    type="button"
                    (click)="onApprove(item.id)"
                    [disabled]="facade.loading()"
                  >
                    Approve
                  </button>
                  <button
                    mat-stroked-button
                    color="warn"
                    type="button"
                    (click)="onReject(item.id)"
                    [disabled]="facade.loading()"
                  >
                    Reject
                  </button>
                }
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .acceptance-container {
        display: grid;
        gap: 24px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }

      .acceptance-header {
        background: var(--mat-sys-surface-container, #f5f5f5);
      }

      .acceptance-stats {
        display: flex;
        gap: 24px;
        margin-top: 8px;
      }

      .stat-item {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant, #4b5563);
      }

      .acceptance-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 48px 24px;
      }

      .acceptance-loading p {
        margin: 0;
        font: var(--mat-sys-body-large);
        color: var(--mat-sys-on-surface-variant, #4b5563);
      }

      .acceptance-error {
        border-color: var(--mat-sys-error, #b91c1c);
        background: var(--mat-sys-error-container, #fee);
      }

      .error-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .error-content p {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-error-container, #7f1d1d);
      }

      .acceptance-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px 24px;
      }

      .acceptance-empty mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--mat-sys-on-surface-variant, #9ca3af);
      }

      .acceptance-empty p {
        margin-top: 16px;
        font: var(--mat-sys-body-large);
        color: var(--mat-sys-on-surface-variant, #6b7280);
      }

      .acceptance-list {
        display: grid;
        gap: 16px;
      }

      .acceptance-item {
        transition: box-shadow 0.2s ease;
      }

      .acceptance-item.selected {
        box-shadow: 0 0 0 2px var(--mat-sys-primary, #1976d2);
      }

      .acceptance-item:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
})
export class AcceptanceContainerComponent implements OnInit {
  /**
   * Inject facade only - NO stores, use cases, or services
   * DDD Layer Compliance: Presentation → Application (facade)
   */
  readonly facade = inject(AcceptanceFacade);

  ngOnInit(): void {
    // Load items on initialization
    this.facade.loadItems();
  }

  onRefresh(): void {
    this.facade.loadItems();
  }

  onSelectItem(itemId: string): void {
    this.facade.selectItem(itemId);
  }

  onApprove(itemId: string): void {
    this.facade.approveItem(itemId);
  }

  onReject(itemId: string): void {
    this.facade.rejectItem(itemId);
  }
}
