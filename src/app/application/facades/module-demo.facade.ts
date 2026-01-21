import { Injectable, inject, signal } from '@angular/core';
import {
  ModuleDemoUseCase,
  ModuleSelectionInput,
  ModuleRefreshInput,
} from '@application/use-cases/demo/module-demo.use-case';

@Injectable({ providedIn: 'root' })
export class ModuleDemoFacade {
  private readonly useCase = inject(ModuleDemoUseCase);

  readonly workspaceId = signal<string | null>(null);
  readonly moduleKeys = signal<ReadonlyArray<string>>([]);
  readonly activeModuleKey = signal<string | null>(null);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.loadState();
    this.workspaceId.set(state.workspaceId);
    this.moduleKeys.set(state.moduleKeys);
    this.activeModuleKey.set(state.activeModuleKey);
    this.loading.set(false);
  }

  async selectModule(input: ModuleSelectionInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.selectModule(input);
    this.workspaceId.set(state.workspaceId);
    this.moduleKeys.set(state.moduleKeys);
    this.activeModuleKey.set(state.activeModuleKey);
    this.loading.set(false);
  }

  async refreshModules(input: ModuleRefreshInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.refreshModules(input);
    this.workspaceId.set(state.workspaceId);
    this.moduleKeys.set(state.moduleKeys);
    this.activeModuleKey.set(state.activeModuleKey);
    this.loading.set(false);
  }
}
