import { ValidationError } from '../../shared/errors';
import { Result } from '../../shared/types/result.type';

/**
 * Role represents a membership role in a workspace or organization.
 */
export type RoleValue = 'owner' | 'admin' | 'member' | 'viewer';

export class Role {
  private readonly value: RoleValue;

  private constructor(value: RoleValue) {
    this.value = value;
  }

  static create(value: string): Result<Role, ValidationError> {
    const validRoles: RoleValue[] = ['owner', 'admin', 'member', 'viewer'];
    if (!validRoles.includes(value as RoleValue)) {
      return Result.fail(
        new ValidationError(
          `Invalid role. Must be one of: ${validRoles.join(', ')}`
        )
      );
    }
    return Result.ok(new Role(value as RoleValue));
  }

  static owner(): Role {
    return new Role('owner');
  }

  static admin(): Role {
    return new Role('admin');
  }

  static member(): Role {
    return new Role('member');
  }

  static viewer(): Role {
    return new Role('viewer');
  }

  getValue(): RoleValue {
    return this.value;
  }

  isOwner(): boolean {
    return this.value === 'owner';
  }

  isAdmin(): boolean {
    return this.value === 'admin';
  }

  isMember(): boolean {
    return this.value === 'member';
  }

  isViewer(): boolean {
    return this.value === 'viewer';
  }

  canManage(): boolean {
    return this.value === 'owner' || this.value === 'admin';
  }

  canWrite(): boolean {
    return this.value !== 'viewer';
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
