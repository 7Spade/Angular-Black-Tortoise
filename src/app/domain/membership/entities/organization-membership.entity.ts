import type { MembershipId } from '../value-objects/membership-id.value-object';
import type { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import type { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { MembershipRole } from '../enums/membership-role.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import { AggregateRoot } from '@domain/shared/events';
import { IllegalStateTransitionError, AuthorizationError } from '@domain/shared/errors';
import {
  MembershipCreatedEvent,
  MembershipActivatedEvent,
  MembershipSuspendedEvent,
  MembershipRoleChangedEvent,
} from '../events';

/**
 * OrganizationMembership represents the relationship between a user and an organization.
 * This is an aggregate root enforcing membership invariants.
 * 
 * DDD Compliance:
 * - Extends AggregateRoot for event collection
 * - Emits domain events for state changes
 * - Enforces business rules through behavior methods
 * - Immutable core properties (id, organizationId, userId)
 */
export class OrganizationMembership extends AggregateRoot {
  readonly id: MembershipId;
  readonly organizationId: OrganizationId;
  readonly userId: UserId;
  private role: MembershipRole;
  private status: MembershipStatus;

  private constructor(
    props: {
      id: MembershipId;
      organizationId: OrganizationId;
      userId: UserId;
      role: MembershipRole;
      status: MembershipStatus;
    },
    isNew: boolean = false
  ) {
    super();
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.userId = props.userId;
    this.role = props.role;
    this.status = props.status;

    // Emit creation event for new memberships
    if (isNew) {
      this.addDomainEvent(
        new MembershipCreatedEvent(
          this.id.getValue(),
          this.organizationId.getValue(),
          this.userId.getValue(),
          this.role
        )
      );
    }
  }

  static create(
    props: {
      id: MembershipId;
      organizationId: OrganizationId;
      userId: UserId;
      role: MembershipRole;
      status: MembershipStatus;
    },
    isNew?: boolean
  ): OrganizationMembership {
    return new OrganizationMembership(props, isNew ?? false);
  }

  /**
   * Get current role.
   */
  getRole(): MembershipRole {
    return this.role;
  }

  /**
   * Get current status.
   */
  getStatus(): MembershipStatus {
    return this.status;
  }

  /**
   * Check if the membership is active.
   */
  isActive(): boolean {
    return this.status === MembershipStatus.Active;
  }

  /**
   * Check if the membership is suspended.
   */
  isSuspended(): boolean {
    return this.status === MembershipStatus.Suspended;
  }

  /**
   * Check if the member has admin privileges.
   */
  isAdmin(): boolean {
    return this.role === MembershipRole.Owner || this.role === MembershipRole.Admin;
  }

  /**
   * Check if the member is an owner.
   */
  isOwner(): boolean {
    return this.role === MembershipRole.Owner;
  }

  /**
   * Activate the membership.
   * Business rule: Can activate from suspended or pending state.
   * Emits MembershipActivatedEvent.
   */
  activate(): void {
    if (this.status === MembershipStatus.Active) {
      // Idempotent - already active
      return;
    }

    this.status = MembershipStatus.Active;
    this.addDomainEvent(new MembershipActivatedEvent(this.id.getValue()));
  }

  /**
   * Suspend the membership.
   * Business rule: Can only suspend active memberships.
   * Emits MembershipSuspendedEvent.
   */
  suspend(): void {
    if (this.status === MembershipStatus.Suspended) {
      // Idempotent - already suspended
      return;
    }

    if (this.status !== MembershipStatus.Active) {
      throw new IllegalStateTransitionError(this.status, 'suspend');
    }

    this.status = MembershipStatus.Suspended;
    this.addDomainEvent(new MembershipSuspendedEvent(this.id.getValue()));
  }

  /**
   * Change the role of this membership.
   * Business rule: Cannot change role of Owner (must transfer ownership).
   * Emits MembershipRoleChangedEvent.
   */
  changeRole(newRole: MembershipRole): void {
    if (this.role === newRole) {
      // Idempotent - role unchanged
      return;
    }

    // Business rule: Cannot demote owner through role change
    if (this.role === MembershipRole.Owner) {
      throw new AuthorizationError(
        'Cannot change role of organization owner. Transfer ownership first.'
      );
    }

    // Business rule: Cannot promote to owner through role change
    if (newRole === MembershipRole.Owner) {
      throw new AuthorizationError(
        'Cannot promote to owner through role change. Use ownership transfer.'
      );
    }

    const oldRole = this.role;
    this.role = newRole;
    this.addDomainEvent(
      new MembershipRoleChangedEvent(this.id.getValue(), oldRole, newRole)
    );
  }

  /**
   * Transfer ownership to this membership.
   * Business rule: Can only transfer to active admin.
   */
  promoteToOwner(): void {
    if (this.role === MembershipRole.Owner) {
      // Idempotent - already owner
      return;
    }

    if (this.status !== MembershipStatus.Active) {
      throw new IllegalStateTransitionError(
        this.status,
        'promote to owner'
      );
    }

    const oldRole = this.role;
    this.role = MembershipRole.Owner;
    this.addDomainEvent(
      new MembershipRoleChangedEvent(this.id.getValue(), oldRole, MembershipRole.Owner)
    );
  }

  /**
   * Demote from owner to admin.
   * Used during ownership transfer.
   */
  demoteFromOwner(): void {
    if (this.role !== MembershipRole.Owner) {
      // Idempotent - not an owner
      return;
    }

    const oldRole = this.role;
    this.role = MembershipRole.Admin;
    this.addDomainEvent(
      new MembershipRoleChangedEvent(this.id.getValue(), oldRole, MembershipRole.Admin)
    );
  }
}
