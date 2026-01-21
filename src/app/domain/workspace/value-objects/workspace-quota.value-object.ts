import { Result } from '../../shared/types/result.type';
import { ValidationError } from '../../shared/errors/validation.error';

/**
 * WorkspaceQuota represents the usage limits for a workspace.
 */
export class WorkspaceQuota {
  private readonly maxModules: number;
  private readonly maxStorage: number;

  private constructor(maxModules: number, maxStorage: number) {
    this.maxModules = maxModules;
    this.maxStorage = maxStorage;
  }

  static create(props: {
    maxModules: number;
    maxStorage: number;
  }): Result<WorkspaceQuota, ValidationError> {
    if (props.maxModules < 0) {
      return Result.fail(
        new ValidationError('WorkspaceQuota maxModules cannot be negative')
      );
    }
    if (props.maxStorage < 0) {
      return Result.fail(
        new ValidationError('WorkspaceQuota maxStorage cannot be negative')
      );
    }
    return Result.ok(new WorkspaceQuota(props.maxModules, props.maxStorage));
  }

  static unlimited(): WorkspaceQuota {
    return new WorkspaceQuota(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  }

  getMaxModules(): number {
    return this.maxModules;
  }

  getMaxStorage(): number {
    return this.maxStorage;
  }

  equals(other: WorkspaceQuota): boolean {
    return (
      this.maxModules === other.maxModules &&
      this.maxStorage === other.maxStorage
    );
  }

  canAddModules(currentCount: number): boolean {
    return currentCount < this.maxModules;
  }

  canAddStorage(currentUsage: number, toAdd: number): boolean {
    return currentUsage + toAdd <= this.maxStorage;
  }
}
