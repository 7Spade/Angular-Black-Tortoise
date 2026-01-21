import { DomainError } from './domain.error';

/**
 * UnauthorizedError represents an unauthorized access attempt.
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
