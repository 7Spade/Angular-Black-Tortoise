import { Injectable, inject, signal } from '@angular/core';
import {
  SettingsDemoUseCase,
  SettingsUpdateInput,
  SettingsResetInput,
} from '@application/use-cases/demo/settings-demo.use-case';

@Injectable({ providedIn: 'root' })
export class SettingsDemoFacade {
  private readonly useCase = inject(SettingsDemoUseCase);

  readonly workspaceId = signal<string | null>(null);
  readonly themePreference = signal<'system' | 'light' | 'dark'>('system');
  readonly locale = signal<string | null>(null);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.loadState();
    this.workspaceId.set(state.workspaceId);
    this.themePreference.set(state.themePreference);
    this.locale.set(state.locale);
    this.loading.set(false);
  }

  async updateSettings(input: SettingsUpdateInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.updateSettings(input);
    this.workspaceId.set(state.workspaceId);
    this.themePreference.set(state.themePreference);
    this.locale.set(state.locale);
    this.loading.set(false);
  }

  async resetSettings(input: SettingsResetInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.resetSettings(input);
    this.workspaceId.set(state.workspaceId);
    this.themePreference.set(state.themePreference);
    this.locale.set(state.locale);
    this.loading.set(false);
  }
}
