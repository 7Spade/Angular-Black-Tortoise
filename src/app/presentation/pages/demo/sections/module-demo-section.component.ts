import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-module-demo-section',
  standalone: true,
  imports: [MatCardModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="demo-section">
      <mat-card-header>
        <mat-card-title>Module Demo</mat-card-title>
        <mat-card-subtitle>Context only</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <!-- DEMO RULE:
             Workspace is provided by route context.
             Demo MUST NOT query, select, or mutate workspace state. -->
        <p class="demo-meta">Context Only</p>
        <mat-divider />
        <p class="demo-meta">Workspace: {{ workspaceId() }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .demo-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .demo-meta {
        margin: 0;
        font: var(--mat-sys-body-medium);
      }
    `,
  ],
})
export class ModuleDemoSectionComponent {
  readonly workspaceId = input.required<string>();
}
