export interface ModuleDemoState {
  readonly workspaceId: string | null;
  readonly moduleKeys: ReadonlyArray<string>;
  readonly activeModuleKey: string | null;
  readonly loading: boolean;
}

export interface ModuleSelectionInput {
  readonly workspaceId: string;
  readonly moduleKey: string;
}

export interface ModuleRefreshInput {
  readonly workspaceId: string;
}

export class ModuleDemoUseCase {
  async loadState(): Promise<ModuleDemoState> {
    return {
      workspaceId: null,
      moduleKeys: [],
      activeModuleKey: null,
      loading: false,
    };
  }

  async selectModule(
    input: ModuleSelectionInput,
  ): Promise<ModuleDemoState> {
    return {
      workspaceId: input.workspaceId,
      moduleKeys: [],
      activeModuleKey: input.moduleKey,
      loading: false,
    };
  }

  async refreshModules(
    input: ModuleRefreshInput,
  ): Promise<ModuleDemoState> {
    return {
      workspaceId: input.workspaceId,
      moduleKeys: [],
      activeModuleKey: null,
      loading: false,
    };
  }
}
