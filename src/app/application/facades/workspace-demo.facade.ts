import { Injectable, signal } from '@angular/core';

/**
 * Simplified demo facade - no overengineered use-case layer.
 * Previously had a use-case that just returned mock objects with no I/O, async, or cross-aggregate logic.
 * Now: direct signal state management for demo purposes.
 * 
 * NOTE: Production workspace logic uses WorkspaceFacade + WorkspaceStore (real I/O).
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceDemoFacade {
  readonly activeWorkspaceId = signal<string | null>(null);
  readonly ownerId = signal<string | null>(null);
  readonly ownerType = signal<'user' | 'organization' | null>(null);
  readonly moduleIds = signal<ReadonlyArray<string>>([]);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    // Demo initialization - no real I/O
    this.activeWorkspaceId.set(null);
    this.ownerId.set(null);
    this.ownerType.set(null);
    this.moduleIds.set([]);
    this.loading.set(false);
  }

  async selectOwner(input: {
    ownerId: string;
    ownerType: 'user' | 'organization';
  }): Promise<void> {
    // Demo owner selection - would connect to real WorkspaceStore in production
    this.loading.set(true);
    this.activeWorkspaceId.set(null);
    this.ownerId.set(input.ownerId);
    this.ownerType.set(input.ownerType);
    this.moduleIds.set([]);
    this.loading.set(false);
  }

  async selectWorkspace(input: { workspaceId: string }): Promise<void> {
    // Demo workspace selection - would connect to real WorkspaceStore in production
    this.loading.set(true);
    this.activeWorkspaceId.set(input.workspaceId);
    this.ownerId.set(null);
    this.ownerType.set(null);
    this.moduleIds.set([]);
    this.loading.set(false);
  }
}
