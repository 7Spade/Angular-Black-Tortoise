import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PermissionDemoFacade } from '@application/facades/permission-demo.facade';

@Component({
  selector: 'app-permission-demo-section',
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
        <mat-card-title>Permission Demo</mat-card-title>
        <mat-card-subtitle>Permission entrypoints</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="demo-field">
          <mat-form-field appearance="outline">
            <mat-label>Workspace ID</mat-label>
            <input matInput [value]="workspaceId()" (input)="onWorkspaceIdInput($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Scope</mat-label>
            <mat-select [value]="scope() ?? ''" (selectionChange)="onScopeSelect($event.value)">
              <mat-option value="workspace">workspace</mat-option>
              <mat-option value="module">module</mat-option>
              <mat-option value="entity">entity</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Permission</mat-label>
            <input matInput [value]="permission()" (input)="onPermissionInput($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Identity ID</mat-label>
            <input matInput [value]="identityId()" (input)="onIdentityIdInput($any($event.target).value)" />
          </mat-form-field>
        </div>
        <p class="demo-meta">Scope: {{ scopeSummary() }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-stroked-button type="button" (click)="onInitialize()">Initialize</button>
        <button mat-stroked-button type="button" (click)="onSelectScope()">Select Scope</button>
        <button mat-raised-button color="primary" type="button" (click)="onEvaluate()">Evaluate</button>
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
export class PermissionDemoSectionComponent {
  private readonly facade = inject(PermissionDemoFacade);

  readonly workspaceId = signal('');
  readonly scope = signal<'workspace' | 'module' | 'entity' | null>(null);
  readonly permission = signal('');
  readonly identityId = signal('');
  
  scopeSummary(): string {
    const workspace = this.workspaceId().trim();
    const scope = this.scope();
    return workspace && scope ? `${workspace}/${scope}` : 'not selected';
  }

  onWorkspaceIdInput(value: string): void {
    this.workspaceId.set(value);
  }

  onScopeSelect(value: 'workspace' | 'module' | 'entity'): void {
    this.scope.set(value);
  }

  onPermissionInput(value: string): void {
    this.permission.set(value);
  }

  onIdentityIdInput(value: string): void {
    this.identityId.set(value);
  }

  async onInitialize(): Promise<void> {
    await this.facade.initialize();
  }

  async onSelectScope(): Promise<void> {
    const workspaceId = this.workspaceId().trim();
    const scope = this.scope();
    if (!workspaceId || !scope) {
      return;
    }
    await this.facade.selectScope({ workspaceId, scope });
  }

  async onEvaluate(): Promise<void> {
    const permission = this.permission().trim();
    const identityId = this.identityId().trim();
    if (!permission || !identityId) {
      return;
    }
    const result = await this.facade.evaluatePermission({ permission, identityId });
    console.log('Permission evaluation:', result);
  }
}
