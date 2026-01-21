export interface PermissionDemoState {
  readonly workspaceId: string | null;
  readonly scope: 'workspace' | 'module' | 'entity' | null;
  readonly permissions: ReadonlyArray<string>;
  readonly loading: boolean;
}

export interface PermissionScopeInput {
  readonly workspaceId: string;
  readonly scope: 'workspace' | 'module' | 'entity';
}

export interface PermissionEvaluationInput {
  readonly workspaceId: string;
  readonly action: 'read' | 'write' | 'admin';
}

export interface PermissionEvaluationResult {
  readonly allowed: boolean;
}

export class PermissionDemoUseCase {
  async loadState(): Promise<PermissionDemoState> {
    return {
      workspaceId: null,
      scope: null,
      permissions: [],
      loading: false,
    };
  }

  async selectScope(
    input: PermissionScopeInput,
  ): Promise<PermissionDemoState> {
    return {
      workspaceId: input.workspaceId,
      scope: input.scope,
      permissions: [],
      loading: false,
    };
  }

  async evaluatePermission(
    _input: PermissionEvaluationInput,
  ): Promise<PermissionEvaluationResult> {
    return { allowed: false };
  }
}
