export interface WorkspaceDemoState {
  readonly activeWorkspaceId: string | null;
  readonly ownerId: string | null;
  readonly ownerType: 'user' | 'organization' | null;
  readonly moduleIds: ReadonlyArray<string>;
  readonly loading: boolean;
}

export interface WorkspaceOwnerSelectionInput {
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
}

export interface WorkspaceSelectionInput {
  readonly workspaceId: string;
}

export class WorkspaceDemoUseCase {
  async loadState(): Promise<WorkspaceDemoState> {
    return {
      activeWorkspaceId: null,
      ownerId: null,
      ownerType: null,
      moduleIds: [],
      loading: false,
    };
  }

  async selectOwner(
    input: WorkspaceOwnerSelectionInput,
  ): Promise<WorkspaceDemoState> {
    return {
      activeWorkspaceId: null,
      ownerId: input.ownerId,
      ownerType: input.ownerType,
      moduleIds: [],
      loading: false,
    };
  }

  async selectWorkspace(
    input: WorkspaceSelectionInput,
  ): Promise<WorkspaceDemoState> {
    return {
      activeWorkspaceId: input.workspaceId,
      ownerId: null,
      ownerType: null,
      moduleIds: [],
      loading: false,
    };
  }
}
