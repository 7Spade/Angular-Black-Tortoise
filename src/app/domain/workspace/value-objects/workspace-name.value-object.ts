/**
 * WorkspaceName - Name of a workspace with validation
 */
export class WorkspaceName {
  private constructor(private readonly value: string) {}

  static create(value: string): WorkspaceName {
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      throw new Error('Workspace name cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new Error('Workspace name cannot exceed 100 characters');
    }
    return new WorkspaceName(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: WorkspaceName): boolean {
    return this.value === other.value;
  }
}
