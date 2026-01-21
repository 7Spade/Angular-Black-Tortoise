import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * PartnerAccessLevel is a value object representing access levels for partners.
 * Valid levels: Limited, Standard, Full
 * Returns Result<PartnerAccessLevel, ValidationError> for invalid levels.
 */
export class PartnerAccessLevel {
  private readonly value: 'limited' | 'standard' | 'full';

  private constructor(value: 'limited' | 'standard' | 'full') {
    this.value = value;
  }

  static createLimited(): PartnerAccessLevel {
    return new PartnerAccessLevel('limited');
  }

  static createStandard(): PartnerAccessLevel {
    return new PartnerAccessLevel('standard');
  }

  static createFull(): PartnerAccessLevel {
    return new PartnerAccessLevel('full');
  }

  static fromString(value: string): Result<PartnerAccessLevel, ValidationError> {
    const normalized = value.toLowerCase().trim();
    if (normalized === 'limited') {
      return Result.ok(PartnerAccessLevel.createLimited());
    }
    if (normalized === 'standard') {
      return Result.ok(PartnerAccessLevel.createStandard());
    }
    if (normalized === 'full') {
      return Result.ok(PartnerAccessLevel.createFull());
    }
    return Result.fail(
      new ValidationError(`Invalid partner access level: ${value}. Must be one of: limited, standard, full`)
    );
  }

  isLimited(): boolean {
    return this.value === 'limited';
  }

  isStandard(): boolean {
    return this.value === 'standard';
  }

  isFull(): boolean {
    return this.value === 'full';
  }

  hasMinimumPermissions(): boolean {
    return this.value === 'limited';
  }

  canEditContent(): boolean {
    return this.value === 'standard' || this.value === 'full';
  }

  hasNearMemberPermissions(): boolean {
    return this.value === 'full';
  }

  getValue(): 'limited' | 'standard' | 'full' {
    return this.value;
  }

  equals(other: PartnerAccessLevel): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
