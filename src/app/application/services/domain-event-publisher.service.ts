import { Injectable } from '@angular/core';
import type { DomainEvent } from '@domain/shared/events';

/**
 * Domain Event Publisher service.
 * 
 * This service is responsible for publishing domain events from the application layer.
 * It can be extended to integrate with message buses, analytics, logging, etc.
 * 
 * DDD Compliance:
 * - Application layer publishes events after successful persistence
 * - Domain events are immutable records of facts
 * - Publishing is separate from domain logic
 */
@Injectable({ providedIn: 'root' })
export class DomainEventPublisher {
  /**
   * Publish a batch of domain events.
   * Currently logs events - can be extended for real event bus integration.
   */
  publishAll(events: readonly DomainEvent[]): void {
    if (events.length === 0) {
      return;
    }

    // Log events (can be extended to send to event bus, analytics, etc.)
    console.log('[DomainEvents] Publishing events:', events);

    // Future: integrate with message bus, external event store, etc.
    // Example:
    // events.forEach(event => this.messageBus.publish(event));
  }

  /**
   * Publish a single domain event.
   */
  publish(event: DomainEvent): void {
    this.publishAll([event]);
  }
}
