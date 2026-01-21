import { Injectable, signal } from '@angular/core';

/**
 * Simplified demo facade - no overengineered use-case layer.
 * Previously had a use-case that just returned mock objects with no I/O, async, or cross-aggregate logic.
 * Now: direct signal state management for demo purposes.
 */
@Injectable({ providedIn: 'root' })
export class IdentityDemoFacade {
  readonly currentIdentityId = signal<string | null>(null);
  readonly identityType = signal<'user' | 'organization' | 'bot' | null>(null);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    // Demo initialization - no real I/O
    this.currentIdentityId.set(null);
    this.identityType.set(null);
    this.loading.set(false);
  }

  async selectIdentity(input: {
    identityId: string;
    identityType: 'user' | 'organization' | 'bot';
  }): Promise<void> {
    // Demo selection - would connect to real IdentityStore in production
    this.loading.set(true);
    this.currentIdentityId.set(input.identityId);
    this.identityType.set(input.identityType);
    this.loading.set(false);
  }

  async checkAccess(input: {
    identityId: string;
    capability: 'read' | 'write' | 'admin';
  }): Promise<{ allowed: boolean }> {
    // Demo access check - trivial logic, no real permission system
    return { allowed: input.identityId.trim().length > 0 };
  }
}
