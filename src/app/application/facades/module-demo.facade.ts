import { Injectable, signal } from '@angular/core';

/**
 * Simplified demo facade - no overengineered use-case layer.
 * Previously had a use-case that just returned mock objects with no I/O, async, or cross-aggregate logic.
 * Now: direct signal state management for demo purposes.
 */
@Injectable({ providedIn: 'root' })
export class ModuleDemoFacade {
  readonly workspaceId = signal<string | null>(null);
  readonly moduleKeys = signal<ReadonlyArray<string>>([]);
  readonly activeModuleKey = signal<string | null>(null);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    // Demo initialization - no real I/O
    this.workspaceId.set(null);
    this.moduleKeys.set([]);
    this.activeModuleKey.set(null);
    this.loading.set(false);
  }

  async selectModule(input: {
    workspaceId: string;
    moduleKey: string;
  }): Promise<void> {
    // Demo selection - would connect to real ModuleStore in production
    this.loading.set(true);
    this.workspaceId.set(input.workspaceId);
    this.activeModuleKey.set(input.moduleKey);
    this.loading.set(false);
  }

  async refreshModules(input: { workspaceId: string }): Promise<void> {
    // Demo refresh - would call real repository in production
    this.loading.set(true);
    this.workspaceId.set(input.workspaceId);
    this.moduleKeys.set([]);
    this.activeModuleKey.set(null);
    this.loading.set(false);
  }
}
