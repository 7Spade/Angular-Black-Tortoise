import type { WorkspaceOwnerType } from '@domain/account/entities/identity.entity';

// Workspace represents a logical container owned by a user or organization only.
export interface Workspace {
  readonly id: string;
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
  readonly moduleIds: string[];
}
