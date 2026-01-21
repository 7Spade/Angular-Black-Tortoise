import { ValidationError } from '../../shared/errors';
import { Result } from '../../shared/types/result.type';

/**
 * AccountType represents the type of account in membership contexts.
 */
export type AccountTypeValue = 'user' | 'team' | 'partner';

export class AccountType {
  private readonly value: AccountTypeValue;

  private constructor(value: AccountTypeValue) {
    this.value = value;
  }

  static create(value: string): Result<AccountType, ValidationError> {
    const validTypes: AccountTypeValue[] = ['user', 'team', 'partner'];
    if (!validTypes.includes(value as AccountTypeValue)) {
      return Result.fail(
        new ValidationError(
          `Invalid account type. Must be one of: ${validTypes.join(', ')}`
        )
      );
    }
    return Result.ok(new AccountType(value as AccountTypeValue));
  }

  static user(): AccountType {
    return new AccountType('user');
  }

  static team(): AccountType {
    return new AccountType('team');
  }

  static partner(): AccountType {
    return new AccountType('partner');
  }

  getValue(): AccountTypeValue {
    return this.value;
  }

  isUser(): boolean {
    return this.value === 'user';
  }

  isTeam(): boolean {
    return this.value === 'team';
  }

  isPartner(): boolean {
    return this.value === 'partner';
  }

  equals(other: AccountType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
