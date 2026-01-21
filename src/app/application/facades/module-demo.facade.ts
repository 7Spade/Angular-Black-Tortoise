import { Injectable, computed, signal } from '@angular/core';
import {
  ModuleDemoUseCase,
  ModuleDemoState,
  ModuleSelectionInput,
  ModuleRefreshInput,
} from '@application/use-cases/demo/module-demo.use-case';

@Injectable({ providedIn: 'root' })
export class ModuleDemoFacade {
  private readonly state = signal<ModuleDemoState>({
    workspaceId: null,
    moduleKeys: [],
    activeModuleKey: null,
    loading: false,
  });

  readonly workspaceId = computed(() => this.state().workspaceId);
  readonly moduleKeys = computed(() => this.state().moduleKeys);
  readonly activeModuleKey = computed(() => this.state().activeModuleKey);
  readonly loading = computed(() => this.state().loading);

  constructor(private readonly useCase: ModuleDemoUseCase) {}

  async initialize(): Promise<void> {
    this.state.set(await this.useCase.loadState());
  }

  async selectModule(input: ModuleSelectionInput): Promise<void> {
    this.state.set(await this.useCase.selectModule(input));
  }

  async refreshModules(input: ModuleRefreshInput): Promise<void> {
    this.state.set(await this.useCase.refreshModules(input));
  }
}
