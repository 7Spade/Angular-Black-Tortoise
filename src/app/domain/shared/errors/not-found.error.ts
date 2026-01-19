import { DomainError } from './domain.error';

/**
 * NotFoundError represents a resource that was not found.
 */
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
