import { DomainError } from './domain.error';

/**
 * Error thrown when an aggregate invariant is violated.
 * Invariants are business rules that must always hold true.
 */
export class InvariantViolationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvariantViolationError';
    Object.setPrototypeOf(this, InvariantViolationError.prototype);
  }
}
