import {
  PermissionDemoUseCase,
  PermissionDemoState,
  PermissionScopeInput,
  PermissionEvaluationInput,
  PermissionEvaluationResult,
} from '@application/use-cases/demo/permission-demo.use-case';

export class PermissionDemoFacade {
  private state: PermissionDemoState = {
    workspaceId: null,
    scope: null,
    permissions: [],
    loading: false,
  };

  constructor(private readonly useCase: PermissionDemoUseCase) {}

  workspaceId(): string | null {
    return this.state.workspaceId;
  }

  scope(): 'workspace' | 'module' | 'entity' | null {
    return this.state.scope;
  }

  permissions(): ReadonlyArray<string> {
    return this.state.permissions;
  }

  loading(): boolean {
    return this.state.loading;
  }

  async initialize(): Promise<void> {
    this.state = await this.useCase.loadState();
  }

  async selectScope(input: PermissionScopeInput): Promise<void> {
    this.state = await this.useCase.selectScope(input);
  }

  async evaluatePermission(
    input: PermissionEvaluationInput,
  ): Promise<PermissionEvaluationResult> {
    return this.useCase.evaluatePermission(input);
  }
}
