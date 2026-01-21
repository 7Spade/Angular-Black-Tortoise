import {
  ModuleDemoUseCase,
  ModuleDemoState,
  ModuleSelectionInput,
  ModuleRefreshInput,
} from '@application/use-cases/demo/module-demo.use-case';

export class ModuleDemoFacade {
  private state: ModuleDemoState = {
    workspaceId: null,
    moduleKeys: [],
    activeModuleKey: null,
    loading: false,
  };

  constructor(private readonly useCase: ModuleDemoUseCase) {}

  workspaceId(): string | null {
    return this.state.workspaceId;
  }

  moduleKeys(): ReadonlyArray<string> {
    return this.state.moduleKeys;
  }

  activeModuleKey(): string | null {
    return this.state.activeModuleKey;
  }

  loading(): boolean {
    return this.state.loading;
  }

  async initialize(): Promise<void> {
    this.state = await this.useCase.loadState();
  }

  async selectModule(input: ModuleSelectionInput): Promise<void> {
    this.state = await this.useCase.selectModule(input);
  }

  async refreshModules(input: ModuleRefreshInput): Promise<void> {
    this.state = await this.useCase.refreshModules(input);
  }
}
