import { Injectable, computed, signal } from '@angular/core';
import {
  PermissionDemoUseCase,
  PermissionDemoState,
  PermissionScopeInput,
  PermissionEvaluationInput,
  PermissionEvaluationResult,
} from '@application/use-cases/demo/permission-demo.use-case';

@Injectable({ providedIn: 'root' })
export class PermissionDemoFacade {
  private readonly state = signal<PermissionDemoState>({
    workspaceId: null,
    scope: null,
    permissions: [],
    loading: false,
  });

  readonly workspaceId = computed(() => this.state().workspaceId);
  readonly scope = computed(() => this.state().scope);
  readonly permissions = computed(() => this.state().permissions);
  readonly loading = computed(() => this.state().loading);

  constructor(private readonly useCase: PermissionDemoUseCase) {}

  async initialize(): Promise<void> {
    this.state.set(await this.useCase.loadState());
  }

  async selectScope(input: PermissionScopeInput): Promise<void> {
    this.state.set(await this.useCase.selectScope(input));
  }

  async evaluatePermission(
    input: PermissionEvaluationInput,
  ): Promise<PermissionEvaluationResult> {
    return this.useCase.evaluatePermission(input);
  }
}
