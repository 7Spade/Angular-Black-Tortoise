import { Injectable, inject, signal } from '@angular/core';
import {
  PermissionDemoUseCase,
  PermissionScopeInput,
  PermissionEvaluationInput,
  PermissionEvaluationResult,
} from '@application/use-cases/demo/permission-demo.use-case';

@Injectable({ providedIn: 'root' })
export class PermissionDemoFacade {
  private readonly useCase = inject(PermissionDemoUseCase);

  readonly workspaceId = signal<string | null>(null);
  readonly scope = signal<'workspace' | 'module' | 'entity' | null>(null);
  readonly permissions = signal<ReadonlyArray<string>>([]);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.loadState();
    this.workspaceId.set(state.workspaceId);
    this.scope.set(state.scope);
    this.permissions.set(state.permissions);
    this.loading.set(false);
  }

  async selectScope(input: PermissionScopeInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.selectScope(input);
    this.workspaceId.set(state.workspaceId);
    this.scope.set(state.scope);
    this.permissions.set(state.permissions);
    this.loading.set(false);
  }

  async evaluatePermission(
    input: PermissionEvaluationInput,
  ): Promise<PermissionEvaluationResult> {
    return this.useCase.evaluatePermission(input);
  }
}
