import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a workspace is deleted.
 */
export class WorkspaceDeletedEvent extends BaseDomainEvent {
  readonly eventType = 'WorkspaceDeleted';

  constructor(public readonly aggregateId: string) {
    super();
  }
}
