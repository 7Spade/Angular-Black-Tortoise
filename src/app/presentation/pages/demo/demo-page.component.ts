import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IdentityDemoSectionComponent } from './sections/identity-demo-section.component';
import { WorkspaceDemoSectionComponent } from './sections/workspace-demo-section.component';
import { ModuleDemoSectionComponent } from './sections/module-demo-section.component';
import { PermissionDemoSectionComponent } from './sections/permission-demo-section.component';
import { SettingsDemoSectionComponent } from './sections/settings-demo-section.component';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [
    MatCardModule,
    IdentityDemoSectionComponent,
    WorkspaceDemoSectionComponent,
    ModuleDemoSectionComponent,
    PermissionDemoSectionComponent,
    SettingsDemoSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="demo-page">
      <mat-card class="demo-header">
        <mat-card-title>System Demo Hub</mat-card-title>
        <mat-card-subtitle>Feature entrypoints</mat-card-subtitle>
      </mat-card>

      <div class="demo-grid">
        <app-identity-demo-section />
        <app-workspace-demo-section />
        <app-module-demo-section />
        <app-permission-demo-section />
        <app-settings-demo-section />
      </div>
    </section>
  `,
  styles: [
    `
      .demo-page {
        display: grid;
        gap: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .demo-header {
        padding: 8px 16px;
      }

      .demo-grid {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    `,
  ],
})
export class DemoPageComponent {}
