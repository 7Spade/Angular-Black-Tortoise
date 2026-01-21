import { DomainError } from './domain.error';

/**
 * Error thrown when a quota limit is exceeded.
 */
export class QuotaExceededError extends DomainError {
  constructor(
    public readonly quotaType: string,
    public readonly limit: number,
    public readonly attempted: number
  ) {
    super(
      `Quota exceeded: ${quotaType} limit is ${limit}, attempted ${attempted}`
    );
    this.name = 'QuotaExceededError';
    Object.setPrototypeOf(this, QuotaExceededError.prototype);
  }
}
