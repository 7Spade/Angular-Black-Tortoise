import { randomString } from '@shared/utils/string.util';

/**
 * WorkspaceId is a branded identifier for workspace entities.
 */
export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): WorkspaceId {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkspaceId cannot be empty');
    }
    return new WorkspaceId(value.trim());
  }

  /**
   * Generate a new unique workspace ID.
   */
  static generate(): WorkspaceId {
    const timestamp = Date.now().toString(36);
    const random = randomString(8);
    return new WorkspaceId(`ws_${timestamp}_${random}`);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: WorkspaceId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
