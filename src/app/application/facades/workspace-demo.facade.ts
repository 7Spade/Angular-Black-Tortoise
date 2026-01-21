import { Injectable, inject, signal } from '@angular/core';
import {
  WorkspaceDemoUseCase,
  WorkspaceOwnerSelectionInput,
  WorkspaceSelectionInput,
} from '@application/use-cases/demo/workspace-demo.use-case';

@Injectable({ providedIn: 'root' })
export class WorkspaceDemoFacade {
  private readonly useCase = inject(WorkspaceDemoUseCase);

  readonly activeWorkspaceId = signal<string | null>(null);
  readonly ownerId = signal<string | null>(null);
  readonly ownerType = signal<'user' | 'organization' | null>(null);
  readonly moduleIds = signal<ReadonlyArray<string>>([]);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.loadState();
    this.activeWorkspaceId.set(state.activeWorkspaceId);
    this.ownerId.set(state.ownerId);
    this.ownerType.set(state.ownerType);
    this.moduleIds.set(state.moduleIds);
    this.loading.set(false);
  }

  async selectOwner(input: WorkspaceOwnerSelectionInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.selectOwner(input);
    this.activeWorkspaceId.set(state.activeWorkspaceId);
    this.ownerId.set(state.ownerId);
    this.ownerType.set(state.ownerType);
    this.moduleIds.set(state.moduleIds);
    this.loading.set(false);
  }

  async selectWorkspace(input: WorkspaceSelectionInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.selectWorkspace(input);
    this.activeWorkspaceId.set(state.activeWorkspaceId);
    this.ownerId.set(state.ownerId);
    this.ownerType.set(state.ownerType);
    this.moduleIds.set(state.moduleIds);
    this.loading.set(false);
  }
}
