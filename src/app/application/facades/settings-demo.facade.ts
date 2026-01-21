import { Injectable, signal } from '@angular/core';

/**
 * Simplified demo facade - no overengineered use-case layer.
 * Previously had a use-case that just returned mock objects with no I/O, async, or cross-aggregate logic.
 * Now: direct signal state management for demo purposes.
 */
@Injectable({ providedIn: 'root' })
export class SettingsDemoFacade {
  readonly workspaceId = signal<string | null>(null);
  readonly themePreference = signal<'system' | 'light' | 'dark'>('system');
  readonly locale = signal<string | null>(null);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    // Demo initialization - no real I/O
    this.workspaceId.set(null);
    this.themePreference.set('system');
    this.locale.set(null);
    this.loading.set(false);
  }

  async updateSettings(input: {
    workspaceId: string;
    themePreference?: 'system' | 'light' | 'dark';
    locale?: string;
  }): Promise<void> {
    // Demo settings update - would call real repository in production
    this.loading.set(true);
    this.workspaceId.set(input.workspaceId);
    if (input.themePreference) {
      this.themePreference.set(input.themePreference);
    }
    if (input.locale) {
      this.locale.set(input.locale);
    }
    this.loading.set(false);
  }

  async resetSettings(input: { workspaceId: string }): Promise<void> {
    // Demo reset - would call real repository in production
    this.loading.set(true);
    this.workspaceId.set(input.workspaceId);
    this.themePreference.set('system');
    this.locale.set(null);
    this.loading.set(false);
  }
}
