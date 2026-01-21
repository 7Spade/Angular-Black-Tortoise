import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SettingsDemoFacade } from '@application/facades/settings-demo.facade';

@Component({
  selector: 'app-settings-demo-section',
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
        <mat-card-title>Settings Demo</mat-card-title>
        <mat-card-subtitle>Settings entrypoints</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="demo-field">
          <mat-form-field appearance="outline">
            <mat-label>Workspace ID</mat-label>
            <input matInput [value]="workspaceId()" (input)="onWorkspaceIdInput($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Theme Preference</mat-label>
            <mat-select [value]="themePreference()" (selectionChange)="onThemeSelect($event.value)">
              <mat-option value="system">system</mat-option>
              <mat-option value="light">light</mat-option>
              <mat-option value="dark">dark</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Locale</mat-label>
            <input matInput [value]="locale()" (input)="onLocaleInput($any($event.target).value)" />
          </mat-form-field>
        </div>
        <p class="demo-meta">Preview: {{ settingsSummary() }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-stroked-button type="button" (click)="onInitialize()">Initialize</button>
        <button mat-stroked-button type="button" (click)="onReset()">Reset</button>
        <button mat-raised-button color="primary" type="button" (click)="onUpdate()">Update</button>
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
export class SettingsDemoSectionComponent {
  private readonly facade = inject(SettingsDemoFacade);

  readonly workspaceId = signal('');
  readonly themePreference = signal<'system' | 'light' | 'dark'>('system');
  readonly locale = signal('');
  settingsSummary(): string {
    const workspace = this.workspaceId().trim();
    const locale = this.locale().trim();
    return workspace && locale
      ? `${workspace}/${this.themePreference()}/${locale}`
      : 'not set';
  }

  onWorkspaceIdInput(value: string): void {
    this.workspaceId.set(value);
  }

  onThemeSelect(value: 'system' | 'light' | 'dark'): void {
    this.themePreference.set(value);
  }

  onLocaleInput(value: string): void {
    this.locale.set(value);
  }

  async onInitialize(): Promise<void> {
    await this.facade.initialize();
  }

  async onReset(): Promise<void> {
    const workspaceId = this.workspaceId().trim();
    if (!workspaceId) {
      return;
    }
    await this.facade.resetSettings({ workspaceId });
  }

  async onUpdate(): Promise<void> {
    const workspaceId = this.workspaceId().trim();
    const locale = this.locale().trim();
    if (!workspaceId || !locale) {
      return;
    }
    await this.facade.updateSettings({
      workspaceId,
      themePreference: this.themePreference(),
      locale,
    });
  }
}
