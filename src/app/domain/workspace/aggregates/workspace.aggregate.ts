import type { Workspace } from '../entities/workspace.entity';
import type { WorkspaceModule } from '../entities/workspace-module.entity';
import type { ModuleKey } from '../value-objects/module-key.value-object';
import { Result } from '../../shared/types/result.type';
import { DomainError } from '../../shared/errors/domain.error';
import { InvalidStateError } from '../../shared/errors/invalid-state.error';

/**
 * WorkspaceAggregate is the aggregate root enforcing workspace invariants.
 * It ensures consistency across workspace state and business rules.
 * Implements STEP 7 requirements: wraps Workspace entity, enforces consistency rules,
 * manages WorkspaceModule collection, validates quota limits, prevents modifications
 * on archived/deleted workspaces.
 */
export class WorkspaceAggregate {
  private readonly workspace: Workspace;
  private readonly modules: Map<string, WorkspaceModule>;

  private constructor(
    workspace: Workspace,
    modules: Map<string, WorkspaceModule>
  ) {
    this.workspace = workspace;
    this.modules = modules;
  }

  static create(props: {
    workspace: Workspace;
    modules?: WorkspaceModule[];
  }): WorkspaceAggregate {
    const modulesMap = new Map<string, WorkspaceModule>();
    props.modules?.forEach((module) => modulesMap.set(module.id, module));

    return new WorkspaceAggregate(props.workspace, modulesMap);
  }

  /**
   * Get the underlying workspace entity
   */
  getWorkspace(): Workspace {
    return this.workspace;
  }

  /**
   * Get all modules in this workspace
   */
  getModules(): WorkspaceModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get a specific module by id
   */
  getModule(moduleId: string): WorkspaceModule | null {
    return this.modules.get(moduleId) ?? null;
  }

  /**
   * Add a module to the workspace - validates quota and workspace status
   */
  addModule(module: WorkspaceModule): Result<WorkspaceAggregate, DomainError> {
    // Check workspace status
    if (
      this.workspace.status.getValue() === 'archived' ||
      this.workspace.status.getValue() === 'deleted'
    ) {
      return Result.fail(
        new InvalidStateError(
          'Cannot add module to archived or deleted workspace'
        )
      );
    }

    // Check if module already exists
    if (this.modules.has(module.id)) {
      return Result.fail(new InvalidStateError('Module already exists'));
    }

    // Check quota limits
    const currentModuleCount = this.modules.size;
    const maxModules = this.workspace.quota.getMaxModules();
    if (currentModuleCount >= maxModules) {
      return Result.fail(
        new InvalidStateError(
          `Cannot add module: quota limit of ${maxModules} modules reached`
        )
      );
    }

    // Add module to workspace entity
    const updatedWorkspaceResult = this.workspace.addModule(module.id);
    if (updatedWorkspaceResult.isFailure()) {
      return Result.fail(updatedWorkspaceResult.error);
    }

    // Create new aggregate with updated state
    const newModules = new Map(this.modules);
    newModules.set(module.id, module);

    return Result.ok(
      new WorkspaceAggregate(updatedWorkspaceResult.value, newModules)
    );
  }

  /**
   * Remove a module from the workspace - validates workspace status
   */
  removeModule(moduleId: string): Result<WorkspaceAggregate, DomainError> {
    // Check workspace status
    if (
      this.workspace.status.getValue() === 'archived' ||
      this.workspace.status.getValue() === 'deleted'
    ) {
      return Result.fail(
        new InvalidStateError(
          'Cannot remove module from archived or deleted workspace'
        )
      );
    }

    // Check if module exists
    if (!this.modules.has(moduleId)) {
      return Result.fail(new InvalidStateError('Module does not exist'));
    }

    // Remove module from workspace entity
    const updatedWorkspaceResult = this.workspace.removeModule(moduleId);
    if (updatedWorkspaceResult.isFailure()) {
      return Result.fail(updatedWorkspaceResult.error);
    }

    // Create new aggregate with updated state
    const newModules = new Map(this.modules);
    newModules.delete(moduleId);

    return Result.ok(
      new WorkspaceAggregate(updatedWorkspaceResult.value, newModules)
    );
  }

  /**
   * Archive the workspace
   */
  archive(): Result<WorkspaceAggregate, DomainError> {
    const archivedWorkspaceResult = this.workspace.archive();
    if (archivedWorkspaceResult.isFailure()) {
      return Result.fail(archivedWorkspaceResult.error);
    }

    return Result.ok(
      new WorkspaceAggregate(archivedWorkspaceResult.value, this.modules)
    );
  }

  /**
   * Activate the workspace
   */
  activate(): Result<WorkspaceAggregate, DomainError> {
    const activatedWorkspaceResult = this.workspace.activate();
    if (activatedWorkspaceResult.isFailure()) {
      return Result.fail(activatedWorkspaceResult.error);
    }

    return Result.ok(
      new WorkspaceAggregate(activatedWorkspaceResult.value, this.modules)
    );
  }

  /**
   * Check if workspace is active
   */
  isActive(): boolean {
    return this.workspace.status.getValue() === 'active';
  }

  /**
   * Check if workspace is archived
   */
  isArchived(): boolean {
    return this.workspace.status.getValue() === 'archived';
  }

  /**
   * Check if workspace is deleted
   */
  isDeleted(): boolean {
    return this.workspace.status.getValue() === 'deleted';
  }
}

