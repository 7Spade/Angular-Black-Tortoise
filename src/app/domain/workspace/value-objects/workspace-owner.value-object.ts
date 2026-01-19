import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * WorkspaceOwner encapsulates workspace ownership information.
 * Returns Result<WorkspaceOwner, ValidationError> to make validation explicit.
 */
export class WorkspaceOwner {
  private readonly _ownerId: string;
  private readonly _ownerType: WorkspaceOwnerType;

  private constructor(ownerId: string, ownerType: WorkspaceOwnerType) {
    this._ownerId = ownerId;
    this._ownerType = ownerType;
  }

  static create(ownerId: string, ownerType: WorkspaceOwnerType): Result<WorkspaceOwner, ValidationError> {
    if (!ownerId || ownerId.trim().length === 0) {
      return Result.fail(new ValidationError('WorkspaceOwner ownerId cannot be empty'));
    }
    if (ownerType !== 'user' && ownerType !== 'organization') {
      return Result.fail(new ValidationError('WorkspaceOwner ownerType must be user or organization'));
    }
    return Result.ok(new WorkspaceOwner(ownerId.trim(), ownerType));
  }

  // Public property getters
  get ownerId(): string {
    return this._ownerId;
  }

  get ownerType(): WorkspaceOwnerType {
    return this._ownerType;
  }

  // Method API for backward compatibility
  getOwnerId(): string {
    return this._ownerId;
  }

  getOwnerType(): WorkspaceOwnerType {
    return this._ownerType;
  }

  equals(other: WorkspaceOwner): boolean {
    return this._ownerId === other._ownerId && this._ownerType === other._ownerType;
  }

  isUserOwned(): boolean {
    return this._ownerType === 'user';
  }

  isOrganizationOwned(): boolean {
    return this._ownerType === 'organization';
  }
}
