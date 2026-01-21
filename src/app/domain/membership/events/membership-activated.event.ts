import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a membership is activated.
 */
export class MembershipActivatedEvent extends BaseDomainEvent {
  readonly eventType = 'MembershipActivated';

  constructor(public readonly aggregateId: string) {
    super();
  }
}
