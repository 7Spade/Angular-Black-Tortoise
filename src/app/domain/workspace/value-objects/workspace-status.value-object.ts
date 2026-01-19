/**
 * WorkspaceStatus - Status of a workspace
 * Valid values: 'active', 'archived', 'deleted'
 */
export type WorkspaceStatusType = 'active' | 'archived' | 'deleted';

export class WorkspaceStatus {
  private constructor(private readonly value: WorkspaceStatusType) {}

  static create(value: WorkspaceStatusType): WorkspaceStatus {
    return new WorkspaceStatus(value);
  }

  static active(): WorkspaceStatus {
    return new WorkspaceStatus('active');
  }

  static archived(): WorkspaceStatus {
    return new WorkspaceStatus('archived');
  }

  static deleted(): WorkspaceStatus {
    return new WorkspaceStatus('deleted');
  }

  getValue(): WorkspaceStatusType {
    return this.value;
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isArchived(): boolean {
    return this.value === 'archived';
  }

  isDeleted(): boolean {
    return this.value === 'deleted';
  }

  equals(other: WorkspaceStatus): boolean {
    return this.value === other.value;
  }
}
