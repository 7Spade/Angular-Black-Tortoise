import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a module is added to a workspace.
 */
export class ModuleAddedToWorkspaceEvent extends BaseDomainEvent {
  readonly eventType = 'ModuleAddedToWorkspace';

  constructor(
    public readonly aggregateId: string,
    public readonly moduleId: string
  ) {
    super();
  }
}
