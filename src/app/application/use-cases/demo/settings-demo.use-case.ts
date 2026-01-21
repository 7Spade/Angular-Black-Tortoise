export interface SettingsDemoState {
  readonly workspaceId: string | null;
  readonly themePreference: 'system' | 'light' | 'dark';
  readonly locale: string | null;
  readonly loading: boolean;
}

export interface SettingsUpdateInput {
  readonly workspaceId: string;
  readonly themePreference: 'system' | 'light' | 'dark';
  readonly locale: string;
}

export interface SettingsResetInput {
  readonly workspaceId: string;
}

export class SettingsDemoUseCase {
  async loadState(): Promise<SettingsDemoState> {
    return {
      workspaceId: null,
      themePreference: 'system',
      locale: null,
      loading: false,
    };
  }

  async updateSettings(
    input: SettingsUpdateInput,
  ): Promise<SettingsDemoState> {
    return {
      workspaceId: input.workspaceId,
      themePreference: input.themePreference,
      locale: input.locale,
      loading: false,
    };
  }

  async resetSettings(
    _input: SettingsResetInput,
  ): Promise<SettingsDemoState> {
    return {
      workspaceId: null,
      themePreference: 'system',
      locale: null,
      loading: false,
    };
  }
}
