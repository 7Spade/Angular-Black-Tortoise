import { DomainError } from './domain.error';

/**
 * Error thrown when an authorization check fails in the domain.
 */
export class AuthorizationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
