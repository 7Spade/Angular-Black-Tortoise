import { Injectable, computed, signal } from '@angular/core';
import {
  SettingsDemoUseCase,
  SettingsDemoState,
  SettingsUpdateInput,
  SettingsResetInput,
} from '@application/use-cases/demo/settings-demo.use-case';

@Injectable({ providedIn: 'root' })
export class SettingsDemoFacade {
  private readonly state = signal<SettingsDemoState>({
    workspaceId: null,
    themePreference: 'system',
    locale: null,
    loading: false,
  });

  readonly workspaceId = computed(() => this.state().workspaceId);
  readonly themePreference = computed(() => this.state().themePreference);
  readonly locale = computed(() => this.state().locale);
  readonly loading = computed(() => this.state().loading);

  constructor(private readonly useCase: SettingsDemoUseCase) {}

  async initialize(): Promise<void> {
    this.state.set(await this.useCase.loadState());
  }

  async updateSettings(input: SettingsUpdateInput): Promise<void> {
    this.state.set(await this.useCase.updateSettings(input));
  }

  async resetSettings(input: SettingsResetInput): Promise<void> {
    this.state.set(await this.useCase.resetSettings(input));
  }
}
