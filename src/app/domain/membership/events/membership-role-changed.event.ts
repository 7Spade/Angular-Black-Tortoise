import { BaseDomainEvent } from '@domain/shared/events';

/**
 * Event emitted when a membership role is changed.
 */
export class MembershipRoleChangedEvent extends BaseDomainEvent {
  readonly eventType = 'MembershipRoleChanged';

  constructor(
    public readonly aggregateId: string,
    public readonly oldRole: string,
    public readonly newRole: string
  ) {
    super();
  }
}
