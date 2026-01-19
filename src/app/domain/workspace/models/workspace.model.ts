import type { WorkspaceOwnerType } from '@domain/identity/types/identity.types';

export interface Workspace {
  readonly id: string;
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
  readonly moduleIds: string[];
}
