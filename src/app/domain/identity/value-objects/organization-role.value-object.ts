import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * OrganizationRole is a value object representing roles within an organization.
 * Valid roles: Owner, Admin, Member
 * Returns Result<OrganizationRole, ValidationError> for invalid roles.
 */
export class OrganizationRole {
  private readonly value: 'owner' | 'admin' | 'member';

  private constructor(value: 'owner' | 'admin' | 'member') {
    this.value = value;
  }

  static createOwner(): OrganizationRole {
    return new OrganizationRole('owner');
  }

  static createAdmin(): OrganizationRole {
    return new OrganizationRole('admin');
  }

  static createMember(): OrganizationRole {
    return new OrganizationRole('member');
  }

  static fromString(value: string): Result<OrganizationRole, ValidationError> {
    const normalized = value.toLowerCase().trim();
    if (normalized === 'owner') {
      return Result.ok(OrganizationRole.createOwner());
    }
    if (normalized === 'admin') {
      return Result.ok(OrganizationRole.createAdmin());
    }
    if (normalized === 'member') {
      return Result.ok(OrganizationRole.createMember());
    }
    return Result.fail(
      new ValidationError(`Invalid organization role: ${value}. Must be one of: owner, admin, member`)
    );
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

  canManageOrganization(): boolean {
    return this.value === 'owner' || this.value === 'admin';
  }

  canManageMembers(): boolean {
    return this.value === 'owner' || this.value === 'admin';
  }

  getValue(): 'owner' | 'admin' | 'member' {
    return this.value;
  }

  equals(other: OrganizationRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
