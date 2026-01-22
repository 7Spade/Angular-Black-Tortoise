import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IdentityDemoSectionComponent } from './sections/identity-demo-section.component';
import { WorkspaceDemoSectionComponent } from './sections/workspace-demo-section.component';
import { ModuleDemoSectionComponent } from './sections/module-demo-section.component';
import { PermissionDemoSectionComponent } from './sections/permission-demo-section.component';
import { SettingsDemoSectionComponent } from './sections/settings-demo-section.component';
import { AuthDemoSectionComponent } from './sections/auth-demo-section.component';
import { map } from 'rxjs/operators';

/**
 * Demo Page Component
 * 
 * Consolidated demo hub that replaces:
 * - dashboard-page (authenticated workspace)
 * - home-page (login form)
 * 
 * Architecture Compliance:
 * - Standalone component (Angular 20)
 * - Uses Angular 20 control flow (@if/@for)
 * - OnPush change detection
 * - NO business logic (composition only)
 * - Route context only (no state mutation)
 * 
 * Solution A Implementation:
 * - Merged dashboard/home behaviors into this single page
 * - Extracted sections into separate components
 * - Clean composition with section components
 * 
 * DDD Layer: Presentation (Pages)
 * Dependencies: Feature section components only
 */
@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [
    MatCardModule,
    AuthDemoSectionComponent,
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
        <div class="demo-context">
          <p class="demo-context-label">Context Only</p>
          <p class="demo-context-value">Workspace: {{ workspaceId() }}</p>
          <p class="demo-context-value">Module: {{ moduleId() }}</p>
        </div>
      </mat-card>

      <div class="demo-grid">
        <!-- Authentication Section (from home-page) -->
        <app-auth-demo-section />
        
        <!-- Feature Sections (existing) -->
        <app-identity-demo-section [workspaceId]="workspaceId()" />
        <app-workspace-demo-section [workspaceId]="workspaceId()" />
        <app-module-demo-section [workspaceId]="workspaceId()" />
        <app-permission-demo-section [workspaceId]="workspaceId()" />
        <app-settings-demo-section [workspaceId]="workspaceId()" />
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
        padding: 24px;
        min-height: 100vh;
        background: var(--mat-sys-surface, #fafafa);
      }

      .demo-header {
        padding: 8px 16px;
      }

      .demo-context {
        margin-top: 8px;
        display: grid;
        gap: 4px;
      }

      .demo-context-label {
        margin: 0;
        font: var(--mat-sys-label-large);
        color: var(--mat-sys-on-surface-variant, #4b5563);
      }

      .demo-context-value {
        margin: 0;
        font: var(--mat-sys-body-medium);
      }

      .demo-grid {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    `,
  ],
})
export class DemoPageComponent {
  // DEMO RULE:
  // Workspace is provided by route context.
  // Demo MUST NOT query, select, or mutate workspace state.
  private readonly route = inject(ActivatedRoute);

  readonly workspaceId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('workspaceId') ?? '')),
    { initialValue: '' },
  );

  readonly moduleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('moduleId') ?? '')),
    { initialValue: '' },
  );
}
