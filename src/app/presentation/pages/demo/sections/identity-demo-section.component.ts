import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IdentityDemoFacade } from '@application/facades/identity-demo.facade';

@Component({
  selector: 'app-identity-demo-section',
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
        <mat-card-title>Identity Demo</mat-card-title>
        <mat-card-subtitle>Identity entrypoints</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="demo-field">
          <mat-form-field appearance="outline">
            <mat-label>Identity ID</mat-label>
            <input matInput [value]="identityId()" (input)="onIdentityIdInput($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Identity Type</mat-label>
            <mat-select [value]="identityType() ?? ''" (selectionChange)="onIdentityTypeSelect($event.value)">
              <mat-option value="user">user</mat-option>
              <mat-option value="organization">organization</mat-option>
              <mat-option value="bot">bot</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <p class="demo-meta">Current: {{ identitySummary() }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-stroked-button type="button" (click)="onInitialize()">Initialize</button>
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
export class IdentityDemoSectionComponent {
  private readonly facade = inject(IdentityDemoFacade);

  readonly identityId = signal('');
  readonly identityType = signal<'user' | 'organization' | 'bot' | null>(null);
  identitySummary(): string {
    const id = this.identityId().trim();
    const type = this.identityType();
    return id && type ? `${type}:${id}` : 'not selected';
  }

  onIdentityIdInput(value: string): void {
    this.identityId.set(value);
  }

  onIdentityTypeSelect(value: 'user' | 'organization' | 'bot'): void {
    this.identityType.set(value);
  }

  async onInitialize(): Promise<void> {
    await this.facade.initialize();
  }

  async onSelect(): Promise<void> {
    const id = this.identityId().trim();
    const type = this.identityType();
    if (!id || !type) {
      return;
    }
    await this.facade.selectIdentity({ identityId: id, identityType: type });
  }
}
