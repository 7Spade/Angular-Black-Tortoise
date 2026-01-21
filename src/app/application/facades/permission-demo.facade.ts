import { Injectable, signal } from '@angular/core';

/**
 * Simplified demo facade - no overengineered use-case layer.
 * Previously had a use-case that just returned mock objects with no I/O, async, or cross-aggregate logic.
 * Now: direct signal state management for demo purposes.
 */
@Injectable({ providedIn: 'root' })
export class PermissionDemoFacade {
  readonly workspaceId = signal<string | null>(null);
  readonly scope = signal<'workspace' | 'module' | 'entity' | null>(null);
  readonly permissions = signal<ReadonlyArray<string>>([]);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    // Demo initialization - no real I/O
    this.workspaceId.set(null);
    this.scope.set(null);
    this.permissions.set([]);
    this.loading.set(false);
  }

  async selectScope(input: {
    workspaceId: string;
    scope: 'workspace' | 'module' | 'entity';
  }): Promise<void> {
    // Demo scope selection - would connect to real PermissionStore in production
    this.loading.set(true);
    this.workspaceId.set(input.workspaceId);
    this.scope.set(input.scope);
    this.permissions.set([]);
    this.loading.set(false);
  }

  async evaluatePermission(input: {
    permission: string;
    identityId: string;
  }): Promise<{ allowed: boolean }> {
    // Demo permission check - trivial logic, no real permission system
    return { allowed: input.permission.length > 0 && input.identityId.length > 0 };
  }
}
