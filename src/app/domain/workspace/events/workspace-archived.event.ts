import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a workspace is archived.
 */
export class WorkspaceArchivedEvent extends BaseDomainEvent {
  readonly eventType = 'WorkspaceArchived';

  constructor(public readonly aggregateId: string) {
    super();
  }
}
