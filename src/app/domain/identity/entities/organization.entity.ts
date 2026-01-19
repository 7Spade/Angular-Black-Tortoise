import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { DisplayName } from '../value-objects/display-name.value-object';
import { Result } from '../../shared/types/result.type';
import { DomainError } from '../../shared/errors/domain.error';

/**
 * Organization represents an organization identity with owner and member references.
 * Domain entity according to STEP 3 requirements.
 */
export class Organization {
  readonly id: IdentityId;
  readonly type: 'organization' = 'organization';
  readonly ownerId: IdentityId;
  readonly name: DisplayName;
  readonly memberIds: readonly string[];
  readonly teamIds: readonly string[];
  readonly partnerIds: readonly string[];

  private constructor(props: {
    id: IdentityId;
    ownerId: IdentityId;
    name: DisplayName;
    memberIds: readonly string[];
    teamIds: readonly string[];
    partnerIds: readonly string[];
  }) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.memberIds = props.memberIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
  }

  static create(props: {
    id: IdentityId;
    ownerId: IdentityId;
    name: DisplayName;
    memberIds?: readonly string[];
    teamIds?: readonly string[];
    partnerIds?: readonly string[];
  }): Organization {
    return new Organization({
      id: props.id,
      ownerId: props.ownerId,
      name: props.name,
      memberIds: props.memberIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
    });
  }

  /**
   * Add a member to the organization
   */
  addMember(memberId: string): Result<void, DomainError> {
    if (this.memberIds.includes(memberId)) {
      return Result.fail(
        new DomainError('Member already exists in organization')
      );
    }
    (this.memberIds as string[]).push(memberId);
    return Result.ok(undefined);
  }

  /**
   * Remove a member from the organization
   */
  removeMember(memberId: string): Result<void, DomainError> {
    const index = this.memberIds.indexOf(memberId);
    if (index === -1) {
      return Result.fail(
        new DomainError('Member not found in organization')
      );
    }
    (this.memberIds as string[]).splice(index, 1);
    return Result.ok(undefined);
  }

  /**
   * Check equality by identity id
   */
  equals(other: Organization): boolean {
    return this.id.equals(other.id);
  }
}
