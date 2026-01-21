import {
  WorkspaceDemoUseCase,
  WorkspaceDemoState,
  WorkspaceOwnerSelectionInput,
  WorkspaceSelectionInput,
} from '@application/use-cases/demo/workspace-demo.use-case';

export class WorkspaceDemoFacade {
  private state: WorkspaceDemoState = {
    activeWorkspaceId: null,
    ownerId: null,
    ownerType: null,
    moduleIds: [],
    loading: false,
  };

  constructor(private readonly useCase: WorkspaceDemoUseCase) {}

  activeWorkspaceId(): string | null {
    return this.state.activeWorkspaceId;
  }

  ownerId(): string | null {
    return this.state.ownerId;
  }

  ownerType(): 'user' | 'organization' | null {
    return this.state.ownerType;
  }

  moduleIds(): ReadonlyArray<string> {
    return this.state.moduleIds;
  }

  loading(): boolean {
    return this.state.loading;
  }

  async initialize(): Promise<void> {
    this.state = await this.useCase.loadState();
  }

  async selectOwner(input: WorkspaceOwnerSelectionInput): Promise<void> {
    this.state = await this.useCase.selectOwner(input);
  }

  async selectWorkspace(input: WorkspaceSelectionInput): Promise<void> {
    this.state = await this.useCase.selectWorkspace(input);
  }
}
