import type { ModuleId } from '../value-objects/module-id.value-object';
import type { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';

/**
 * Module represents a feature module that can be attached to workspaces.
 * This is an aggregate root enforcing module invariants.
 */
export class Module {
  readonly id: ModuleId;
  readonly workspaceId: WorkspaceId;
  readonly moduleKey: string;

  private constructor(props: {
    id: ModuleId;
    workspaceId: WorkspaceId;
    moduleKey: string;
  }) {
    if (!props.moduleKey || props.moduleKey.trim().length === 0) {
      throw new Error('Module must have a moduleKey');
    }
    this.id = props.id;
    this.workspaceId = props.workspaceId;
    this.moduleKey = props.moduleKey.trim();
  }

  static create(props: {
    id: ModuleId;
    workspaceId: WorkspaceId;
    moduleKey: string;
  }): Module {
    return new Module(props);
  }
}
