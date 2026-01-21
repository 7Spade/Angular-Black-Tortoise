import { Injectable, computed, signal } from '@angular/core';
import {
  WorkspaceDemoUseCase,
  WorkspaceDemoState,
  WorkspaceOwnerSelectionInput,
  WorkspaceSelectionInput,
} from '@application/use-cases/demo/workspace-demo.use-case';

@Injectable({ providedIn: 'root' })
export class WorkspaceDemoFacade {
  private readonly state = signal<WorkspaceDemoState>({
    activeWorkspaceId: null,
    ownerId: null,
    ownerType: null,
    moduleIds: [],
    loading: false,
  });

  readonly activeWorkspaceId = computed(() => this.state().activeWorkspaceId);
  readonly ownerId = computed(() => this.state().ownerId);
  readonly ownerType = computed(() => this.state().ownerType);
  readonly moduleIds = computed(() => this.state().moduleIds);
  readonly loading = computed(() => this.state().loading);

  constructor(private readonly useCase: WorkspaceDemoUseCase) {}

  async initialize(): Promise<void> {
    this.state.set(await this.useCase.loadState());
  }

  async selectOwner(input: WorkspaceOwnerSelectionInput): Promise<void> {
    this.state.set(await this.useCase.selectOwner(input));
  }

  async selectWorkspace(input: WorkspaceSelectionInput): Promise<void> {
    this.state.set(await this.useCase.selectWorkspace(input));
  }
}
