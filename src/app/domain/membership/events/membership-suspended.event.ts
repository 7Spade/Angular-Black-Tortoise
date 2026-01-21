import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a membership is suspended.
 */
export class MembershipSuspendedEvent extends BaseDomainEvent {
  readonly eventType = 'MembershipSuspended';

  constructor(public readonly aggregateId: string) {
    super();
  }
}
