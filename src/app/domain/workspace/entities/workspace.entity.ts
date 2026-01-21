import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { ModuleId } from '@domain/modules/value-objects/module-id.value-object';

/**
 * Workspace represents a logical container owned by a user or organization only.
 * Minimal domain entity without UI-specific fields.
 */
export class Workspace {
  readonly id: WorkspaceId;
  readonly owner: WorkspaceOwner;
  readonly moduleIds: ReadonlyArray<ModuleId>;

  private constructor(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    moduleIds: ReadonlyArray<ModuleId>;
  }) {
    this.id = props.id;
    this.owner = props.owner;
    this.moduleIds = props.moduleIds;
  }

  static create(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    moduleIds?: ReadonlyArray<ModuleId>;
  }): Workspace {
    return new Workspace({
      id: props.id,
      owner: props.owner,
      moduleIds: props.moduleIds ?? [],
    });
  }
}
