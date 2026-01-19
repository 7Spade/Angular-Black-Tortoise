// WorkspaceModule represents a feature module attached to a workspace.
export interface WorkspaceModule {
  readonly id: string;
  readonly workspaceId: string;
  readonly moduleKey: string;
}
