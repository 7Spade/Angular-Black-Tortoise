import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { ModuleKey } from '../value-objects/module-key.value-object';

/**
 * WorkspaceModule represents a module instance within a workspace.
 * Domain entity according to STEP 6 requirements.
 */
export class WorkspaceModule {
  readonly id: string;
  readonly workspaceId: WorkspaceId;
  readonly moduleKey: ModuleKey;
  readonly config: Record<string, unknown>;

  private constructor(props: {
    id: string;
    workspaceId: WorkspaceId;
    moduleKey: ModuleKey;
    config: Record<string, unknown>;
  }) {
    this.id = props.id;
    this.workspaceId = props.workspaceId;
    this.moduleKey = props.moduleKey;
    this.config = props.config;
  }

  static create(props: {
    id: string;
    workspaceId: WorkspaceId;
    moduleKey: ModuleKey;
    config?: Record<string, unknown>;
  }): WorkspaceModule {
    return new WorkspaceModule({
      id: props.id,
      workspaceId: props.workspaceId,
      moduleKey: props.moduleKey,
      config: props.config ?? {},
    });
  }

  /**
   * Check equality by module id
   */
  equals(other: WorkspaceModule): boolean {
    return this.id === other.id;
  }
}
