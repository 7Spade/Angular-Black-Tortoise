import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { Email } from '../../shared/value-objects/email.value-object';
import type { DisplayName } from '../value-objects/display-name.value-object';
import type { IdentityStatus } from '../value-objects/identity-status.value-object';
import type { Timestamp } from '../../shared/value-objects/timestamp.value-object';

/**
 * User represents a personal identity that can own workspaces.
 * Domain entity with email, displayName, status, and createdAt.
 */
export class User {
  readonly id: IdentityId;
  readonly type: 'user' = 'user';
  readonly email: Email;
  readonly displayName: DisplayName;
  readonly status: IdentityStatus;
  readonly createdAt: Timestamp;

  private constructor(props: {
    id: IdentityId;
    email: Email;
    displayName: DisplayName;
    status: IdentityStatus;
    createdAt: Timestamp;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.displayName = props.displayName;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: IdentityId;
    email: Email;
    displayName: DisplayName;
    status: IdentityStatus;
    createdAt: Timestamp;
  }): User {
    return new User(props);
  }

  /**
   * Check equality by identity id
   */
  equals(other: User): boolean {
    return this.id.equals(other.id);
  }
}
