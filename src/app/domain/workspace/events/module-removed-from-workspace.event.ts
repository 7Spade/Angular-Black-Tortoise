import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a module is removed from a workspace.
 */
export class ModuleRemovedFromWorkspaceEvent extends BaseDomainEvent {
  readonly eventType = 'ModuleRemovedFromWorkspace';

  constructor(
    public readonly aggregateId: string,
    public readonly moduleId: string
  ) {
    super();
  }
}
