import { OrganizationMembership } from '../entities/organization-membership.entity';
import { MembershipId } from '../value-objects/membership-id.value-object';
import type { OrganizationId } from '@domain/identity/value-objects/organization-id.value-object';
import type { UserId } from '@domain/identity/value-objects/user-id.value-object';
import { MembershipRole } from '../enums/membership-role.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import { InvariantViolationError } from '@domain/shared/errors';

/**
 * Factory for creating OrganizationMembership aggregates.
 * 
 * DDD Compliance:
 * - Enforces invariants at creation
 * - Encapsulates creation logic
 * - Ensures valid initial state
 */
export class OrganizationMembershipFactory {
  /**
   * Create a new membership for a user in an organization.
   * Enforces invariants and emits creation event.
   */
  static createNew(props: {
    organizationId: OrganizationId;
    userId: UserId;
    role?: MembershipRole;
    status?: MembershipStatus;
  }): OrganizationMembership {
    // Enforce invariants
    if (!props.organizationId) {
      throw new InvariantViolationError('Membership must have an organization');
    }
    if (!props.userId) {
      throw new InvariantViolationError('Membership must have a user');
    }

    // Generate new ID
    const id = MembershipId.generate();

    // Default to member role and active status
    const role = props.role ?? MembershipRole.Member;
    const status = props.status ?? MembershipStatus.Active;

    return OrganizationMembership.create(
      {
        id,
        organizationId: props.organizationId,
        userId: props.userId,
        role,
        status,
      },
      true // isNew - triggers event
    );
  }

  /**
   * Reconstitute a membership from persistence.
   * Does NOT emit creation event.
   */
  static reconstitute(props: {
    id: MembershipId;
    organizationId: OrganizationId;
    userId: UserId;
    role: MembershipRole;
    status: MembershipStatus;
  }): OrganizationMembership {
    // Enforce invariants
    if (!props.id) {
      throw new InvariantViolationError('Membership must have an ID');
    }
    if (!props.organizationId) {
      throw new InvariantViolationError('Membership must have an organization');
    }
    if (!props.userId) {
      throw new InvariantViolationError('Membership must have a user');
    }

    return OrganizationMembership.create(
      {
        id: props.id,
        organizationId: props.organizationId,
        userId: props.userId,
        role: props.role,
        status: props.status,
      },
      false // not new - no event
    );
  }
}
