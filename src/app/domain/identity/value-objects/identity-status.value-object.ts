import { ValidationError } from '../../shared/errors';
import { Result } from '../../shared/types/result.type';

/**
 * IdentityStatus represents the status of an identity (user, organization, bot).
 */
export type IdentityStatusValue = 'active' | 'suspended' | 'deleted';

export class IdentityStatus {
  private readonly value: IdentityStatusValue;

  private constructor(value: IdentityStatusValue) {
    this.value = value;
  }

  static create(
    value: string
  ): Result<IdentityStatus, ValidationError> {
    const validStatuses: IdentityStatusValue[] = [
      'active',
      'suspended',
      'deleted',
    ];
    if (!validStatuses.includes(value as IdentityStatusValue)) {
      return Result.fail(
        new ValidationError(
          `Invalid identity status. Must be one of: ${validStatuses.join(', ')}`
        )
      );
    }
    return Result.ok(new IdentityStatus(value as IdentityStatusValue));
  }

  static active(): IdentityStatus {
    return new IdentityStatus('active');
  }

  static suspended(): IdentityStatus {
    return new IdentityStatus('suspended');
  }

  static deleted(): IdentityStatus {
    return new IdentityStatus('deleted');
  }

  getValue(): IdentityStatusValue {
    return this.value;
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isSuspended(): boolean {
    return this.value === 'suspended';
  }

  isDeleted(): boolean {
    return this.value === 'deleted';
  }

  equals(other: IdentityStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
