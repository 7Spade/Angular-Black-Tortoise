import type { MembershipId } from '../value-objects/membership-id.value-object';
import type { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import type { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { MembershipRole } from '../enums/membership-role.enum';
import { MembershipStatus } from '../enums/membership-status.enum';

/**
 * OrganizationMembership represents the relationship between a user and an organization.
 * This is an aggregate root enforcing membership invariants.
 */
export class OrganizationMembership {
  readonly id: MembershipId;
  readonly organizationId: OrganizationId;
  readonly userId: UserId;
  readonly role: MembershipRole;
  readonly status: MembershipStatus;

  private constructor(props: {
    id: MembershipId;
    organizationId: OrganizationId;
    userId: UserId;
    role: MembershipRole;
    status: MembershipStatus;
  }) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.userId = props.userId;
    this.role = props.role;
    this.status = props.status;
  }

  static create(props: {
    id: MembershipId;
    organizationId: OrganizationId;
    userId: UserId;
    role: MembershipRole;
    status: MembershipStatus;
  }): OrganizationMembership {
    return new OrganizationMembership(props);
  }

  /**
   * Check if the membership is active.
   */
  isActive(): boolean {
    return this.status === MembershipStatus.Active;
  }

  /**
   * Check if the member has admin privileges.
   */
  isAdmin(): boolean {
    return this.role === MembershipRole.Owner || this.role === MembershipRole.Admin;
  }
}
