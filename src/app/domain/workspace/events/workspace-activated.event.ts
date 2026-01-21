import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a workspace is activated.
 */
export class WorkspaceActivatedEvent extends BaseDomainEvent {
  readonly eventType = 'WorkspaceActivated';

  constructor(public readonly aggregateId: string) {
    super();
  }
}
