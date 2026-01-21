import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ModuleDemoFacade } from '@application/facades/module-demo.facade';

@Component({
  selector: 'app-module-demo-section',
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
        <mat-card-title>Module Demo</mat-card-title>
        <mat-card-subtitle>Module entrypoints</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="demo-field">
          <mat-form-field appearance="outline">
            <mat-label>Workspace ID</mat-label>
            <input matInput [value]="workspaceId()" (input)="onWorkspaceIdInput($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Module Key</mat-label>
            <mat-select [value]="moduleKey() ?? ''" (selectionChange)="onModuleKeySelect($event.value)">
              <mat-option value="overview">overview</mat-option>
              <mat-option value="documents">documents</mat-option>
              <mat-option value="tasks">tasks</mat-option>
              <mat-option value="members">members</mat-option>
              <mat-option value="permissions">permissions</mat-option>
              <mat-option value="settings">settings</mat-option>
              <mat-option value="journal">journal</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <p class="demo-meta">Active module: {{ moduleSummary() }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-stroked-button type="button" (click)="onInitialize()">Initialize</button>
        <button mat-stroked-button type="button" (click)="onRefresh()">Refresh</button>
        <button mat-raised-button color="primary" type="button" (click)="onSelect()">Select</button>
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
export class ModuleDemoSectionComponent {
  private readonly facade = inject(ModuleDemoFacade);

  readonly workspaceId = signal('');
  readonly moduleKey = signal<
    | 'overview'
    | 'documents'
    | 'tasks'
    | 'members'
    | 'permissions'
    | 'settings'
    | 'journal'
    | null
  >(null);
  moduleSummary(): string {
    const workspace = this.workspaceId().trim();
    const moduleKey = this.moduleKey();
    if (!workspace || !moduleKey) {
      return 'not selected';
    }
    return `${workspace}/${moduleKey}`;
  }

  onWorkspaceIdInput(value: string): void {
    this.workspaceId.set(value);
  }

  onModuleKeySelect(
    value:
      | 'overview'
      | 'documents'
      | 'tasks'
      | 'members'
      | 'permissions'
      | 'settings'
      | 'journal',
  ): void {
    this.moduleKey.set(value);
  }

  async onInitialize(): Promise<void> {
    await this.facade.initialize();
  }

  async onRefresh(): Promise<void> {
    const workspaceId = this.workspaceId().trim();
    if (!workspaceId) {
      return;
    }
    await this.facade.refreshModules({ workspaceId });
  }

  async onSelect(): Promise<void> {
    const workspaceId = this.workspaceId().trim();
    const moduleKey = this.moduleKey();
    if (!workspaceId || !moduleKey) {
      return;
    }
    await this.facade.selectModule({ workspaceId, moduleKey });
  }
}
