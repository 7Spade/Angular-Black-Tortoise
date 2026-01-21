import { DomainError } from './domain.error';

/**
 * Error thrown when attempting an illegal state transition.
 */
export class IllegalStateTransitionError extends DomainError {
  constructor(
    public readonly currentState: string,
    public readonly attemptedTransition: string
  ) {
    super(
      `Illegal state transition: cannot ${attemptedTransition} from ${currentState}`
    );
    this.name = 'IllegalStateTransitionError';
    Object.setPrototypeOf(this, IllegalStateTransitionError.prototype);
  }
}
