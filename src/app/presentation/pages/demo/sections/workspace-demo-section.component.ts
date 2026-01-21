import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkspaceDemoFacade } from '@application/facades/workspace-demo.facade';

@Component({
  selector: 'app-workspace-demo-section',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="demo-section">
      <mat-card-header>
        <mat-card-title>Workspace Demo</mat-card-title>
        <mat-card-subtitle>Workspace entrypoints</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="demo-field">
          <mat-form-field appearance="outline">
            <mat-label>Owner ID</mat-label>
            <input matInput [value]="ownerId()" (input)="onOwnerIdInput($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Owner Type</mat-label>
            <mat-select [value]="ownerType() ?? ''" (selectionChange)="onOwnerTypeSelect($event.value)">
              <mat-option value="user">user</mat-option>
              <mat-option value="organization">organization</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Workspace ID</mat-label>
            <input matInput [value]="workspaceId()" (input)="onWorkspaceIdInput($any($event.target).value)" />
          </mat-form-field>
        </div>
        <p class="demo-meta">Active: {{ workspaceSummary() }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-stroked-button type="button" (click)="onInitialize()">Initialize</button>
        <button mat-stroked-button type="button" (click)="onSelectOwner()">Select Owner</button>
        <button mat-raised-button color="primary" type="button" (click)="onSelectWorkspace()">Select Workspace</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .demo-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .demo-field {
        display: grid;
        gap: 12px;
      }

      .demo-meta {
        margin: 0;
        font: var(--mat-sys-body-medium);
      }
    `,
  ],
})
export class WorkspaceDemoSectionComponent {
  private readonly facade = inject(WorkspaceDemoFacade);

  readonly ownerId = signal('');
  readonly ownerType = signal<'user' | 'organization' | null>(null);
  readonly workspaceId = signal('');
  readonly workspaceSummary = computed(() => {
    const id = this.workspaceId().trim();
    const owner = this.ownerId().trim();
    const type = this.ownerType();
    if (id) {
      return `workspace:${id}`;
    }
    if (owner && type) {
      return `${type}:${owner}`;
    }
    return 'not selected';
  });

  onOwnerIdInput(value: string): void {
    this.ownerId.set(value);
  }

  onOwnerTypeSelect(value: 'user' | 'organization'): void {
    this.ownerType.set(value);
  }

  onWorkspaceIdInput(value: string): void {
    this.workspaceId.set(value);
  }

  async onInitialize(): Promise<void> {
    await this.facade.initialize();
  }

  async onSelectOwner(): Promise<void> {
    const ownerId = this.ownerId().trim();
    const ownerType = this.ownerType();
    if (!ownerId || !ownerType) {
      return;
    }
    await this.facade.selectOwner({ ownerId, ownerType });
  }

  async onSelectWorkspace(): Promise<void> {
    const workspaceId = this.workspaceId().trim();
    if (!workspaceId) {
      return;
    }
    await this.facade.selectWorkspace({ workspaceId });
  }
}
