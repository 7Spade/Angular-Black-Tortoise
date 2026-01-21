import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { WorkspaceQuota } from '../value-objects/workspace-quota.value-object';
import type { ModuleId } from '@domain/modules/value-objects/module-id.value-object';
import { WorkspaceLifecycle } from '../enums/workspace-lifecycle.enum';
import { Workspace } from '../entities/workspace.entity';
import { AggregateRoot } from '@domain/shared/events';
import { IllegalStateTransitionError, QuotaExceededError } from '@domain/shared/errors';
import {
  WorkspaceCreatedEvent,
  WorkspaceArchivedEvent,
  WorkspaceActivatedEvent,
  WorkspaceDeletedEvent,
  ModuleAddedToWorkspaceEvent,
  ModuleRemovedFromWorkspaceEvent,
} from '../events';

/**
 * WorkspaceAggregate is the aggregate root enforcing workspace invariants.
 * It ensures consistency across workspace state and business rules.
 * 
 * DDD Compliance:
 * - Extends AggregateRoot for event collection
 * - Emits domain events for all state changes
 * - Enforces business rules through behavior methods
 * - Throws domain errors for invalid operations
 */
export class WorkspaceAggregate extends AggregateRoot {
  private readonly workspace: Workspace;
  private lifecycle: WorkspaceLifecycle;
  private quota: WorkspaceQuota;
  private moduleIds: ModuleId[];

  private constructor(
    workspace: Workspace,
    lifecycle: WorkspaceLifecycle,
    quota: WorkspaceQuota,
    isNew: boolean = false,
  ) {
    super();
    this.workspace = workspace;
    this.lifecycle = lifecycle;
    this.quota = quota;
    this.moduleIds = [...workspace.moduleIds];

    // Emit creation event only for new aggregates
    if (isNew) {
      this.addDomainEvent(
        new WorkspaceCreatedEvent(
          this.workspace.id.getValue(),
          this.workspace.owner.getIdValue(),
          this.workspace.owner.type
        )
      );
    }
  }

  static create(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    lifecycle: WorkspaceLifecycle;
    quota: WorkspaceQuota;
    moduleIds?: ReadonlyArray<ModuleId>;
    isNew?: boolean;
  }): WorkspaceAggregate {
    const workspace = Workspace.create({
      id: props.id,
      owner: props.owner,
      moduleIds: props.moduleIds ?? [],
    });
    return new WorkspaceAggregate(
      workspace,
      props.lifecycle,
      props.quota,
      props.isNew ?? false
    );
  }

  getId(): WorkspaceId {
    return this.workspace.id;
  }

  getOwner(): WorkspaceOwner {
    return this.workspace.owner;
  }

  getLifecycle(): WorkspaceLifecycle {
    return this.lifecycle;
  }

  getQuota(): WorkspaceQuota {
    return this.quota;
  }

  getModuleIds(): ReadonlyArray<ModuleId> {
    return [...this.moduleIds];
  }

  /**
   * Get the underlying workspace entity for persistence.
   * Infrastructure layer uses this to extract entity for serialization.
   */
  toEntity(): Workspace {
    return Workspace.create({
      id: this.workspace.id,
      owner: this.workspace.owner,
      moduleIds: this.moduleIds,
    });
  }

  /**
   * Check if workspace is active.
   */
  isActive(): boolean {
    return this.lifecycle === WorkspaceLifecycle.Active;
  }

  /**
   * Check if workspace is archived.
   */
  isArchived(): boolean {
    return this.lifecycle === WorkspaceLifecycle.Archived;
  }

  /**
   * Check if workspace is deleted.
   */
  isDeleted(): boolean {
    return this.lifecycle === WorkspaceLifecycle.Deleted;
  }

  /**
   * Archive the workspace.
   * Business rule: Cannot archive a deleted workspace.
   * Emits WorkspaceArchivedEvent.
   */
  archive(): void {
    if (this.lifecycle === WorkspaceLifecycle.Deleted) {
      throw new IllegalStateTransitionError(
        WorkspaceLifecycle.Deleted,
        'archive'
      );
    }
    if (this.lifecycle === WorkspaceLifecycle.Archived) {
      // Idempotent - already archived
      return;
    }

    this.lifecycle = WorkspaceLifecycle.Archived;
    this.addDomainEvent(new WorkspaceArchivedEvent(this.workspace.id.getValue()));
  }

  /**
   * Activate the workspace.
   * Business rule: Cannot activate a deleted workspace.
   * Emits WorkspaceActivatedEvent.
   */
  activate(): void {
    if (this.lifecycle === WorkspaceLifecycle.Deleted) {
      throw new IllegalStateTransitionError(
        WorkspaceLifecycle.Deleted,
        'activate'
      );
    }
    if (this.lifecycle === WorkspaceLifecycle.Active) {
      // Idempotent - already active
      return;
    }

    this.lifecycle = WorkspaceLifecycle.Active;
    this.addDomainEvent(new WorkspaceActivatedEvent(this.workspace.id.getValue()));
  }

  /**
   * Delete the workspace (soft delete by changing lifecycle).
   * Business rule: Can be deleted from any state.
   * Emits WorkspaceDeletedEvent.
   */
  delete(): void {
    if (this.lifecycle === WorkspaceLifecycle.Deleted) {
      // Idempotent - already deleted
      return;
    }

    this.lifecycle = WorkspaceLifecycle.Deleted;
    this.addDomainEvent(new WorkspaceDeletedEvent(this.workspace.id.getValue()));
  }

  /**
   * Add a module to the workspace.
   * Business rule: Must respect quota limits.
   * Emits ModuleAddedToWorkspaceEvent.
   */
  addModule(moduleId: ModuleId): void {
    // Check if module already exists
    if (this.moduleIds.some((id) => id.equals(moduleId))) {
      // Idempotent - module already added
      return;
    }

    // Enforce quota
    if (!this.quota.canAddProjects(this.moduleIds.length, 1)) {
      throw new QuotaExceededError(
        'projects',
        this.quota.getMaxProjects(),
        this.moduleIds.length + 1
      );
    }

    this.moduleIds.push(moduleId);
    this.addDomainEvent(
      new ModuleAddedToWorkspaceEvent(
        this.workspace.id.getValue(),
        moduleId.getValue()
      )
    );
  }

  /**
   * Remove a module from the workspace.
   * Business rule: Can only remove existing modules.
   * Emits ModuleRemovedFromWorkspaceEvent.
   */
  removeModule(moduleId: ModuleId): void {
    const index = this.moduleIds.findIndex((id) => id.equals(moduleId));
    if (index === -1) {
      // Idempotent - module not found
      return;
    }

    this.moduleIds.splice(index, 1);
    this.addDomainEvent(
      new ModuleRemovedFromWorkspaceEvent(
        this.workspace.id.getValue(),
        moduleId.getValue()
      )
    );
  }

  /**
   * Check if a module can be added based on quota.
   */
  canAddModule(): boolean {
    return this.quota.canAddProjects(this.moduleIds.length, 1);
  }

  /**
   * Get current module count.
   */
  getModuleCount(): number {
    return this.moduleIds.length;
  }

  /**
   * Check if workspace has a specific module.
   */
  hasModule(moduleId: ModuleId): boolean {
    return this.moduleIds.some((id) => id.equals(moduleId));
  }
}
