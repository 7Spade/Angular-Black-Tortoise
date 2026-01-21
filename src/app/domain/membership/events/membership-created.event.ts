import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a new membership is created.
 */
export class MembershipCreatedEvent extends BaseDomainEvent {
  readonly eventType = 'MembershipCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly role: string
  ) {
    super();
  }
}
