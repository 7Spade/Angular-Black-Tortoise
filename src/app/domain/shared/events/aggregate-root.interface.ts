import type { DomainEvent } from './domain-event.interface';

/**
 * Interface for aggregate roots that can collect and emit domain events.
 * 
 * DDD Compliance:
 * - Aggregates are transaction boundaries
 * - Aggregates collect events during their lifecycle
 * - Events are cleared after being published
 * - Events are immutable
 */
export interface IAggregateRoot {
  /**
   * Get all domain events that have been collected.
   * Returns a readonly copy to prevent external modification.
   */
  getDomainEvents(): readonly DomainEvent[];

  /**
   * Clear all collected domain events.
   * Should be called after events are published.
   */
  clearDomainEvents(): void;
}

/**
 * Base class for aggregate roots with event collection support.
 */
export abstract class AggregateRoot implements IAggregateRoot {
  private domainEvents: DomainEvent[] = [];

  /**
   * Add a domain event to the collection.
   */
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Get all collected domain events.
   */
  getDomainEvents(): readonly DomainEvent[] {
    return [...this.domainEvents];
  }

  /**
   * Clear all domain events.
   */
  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
