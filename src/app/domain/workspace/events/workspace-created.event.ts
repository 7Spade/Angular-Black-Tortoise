import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a new workspace is created.
 */
export class WorkspaceCreatedEvent extends BaseDomainEvent {
  readonly eventType = 'WorkspaceCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly ownerId: string,
    public readonly ownerType: 'user' | 'organization'
  ) {
    super();
  }
}
