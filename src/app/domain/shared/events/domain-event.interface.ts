/**
 * Base interface for all domain events.
 * Domain events are immutable records of facts that have happened in the domain.
 * 
 * DDD Compliance:
 * - Events are immutable (readonly properties)
 * - Events represent past facts (use past tense naming)
 * - Events should be serializable
 * - Events belong to Domain layer
 */
export interface DomainEvent {
  /**
   * Unique identifier for this event instance.
   */
  readonly eventId: string;

  /**
   * When the event occurred.
   */
  readonly occurredAt: Date;

  /**
   * Type of the event (for deserialization/routing).
   */
  readonly eventType: string;

  /**
   * ID of the aggregate that generated this event.
   */
  readonly aggregateId: string;
}

/**
 * Base class for implementing domain events.
 */
export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  abstract readonly eventType: string;
  abstract readonly aggregateId: string;

  constructor() {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}
