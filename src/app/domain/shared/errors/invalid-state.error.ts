import { DomainError } from './domain.error';

/**
 * InvalidStateError represents an invalid state transition or operation.
 */
export class InvalidStateError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateError';
    Object.setPrototypeOf(this, InvalidStateError.prototype);
  }
}
