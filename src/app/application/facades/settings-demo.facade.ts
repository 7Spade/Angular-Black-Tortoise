import {
  SettingsDemoUseCase,
  SettingsDemoState,
  SettingsUpdateInput,
  SettingsResetInput,
} from '@application/use-cases/demo/settings-demo.use-case';

export class SettingsDemoFacade {
  private state: SettingsDemoState = {
    workspaceId: null,
    themePreference: 'system',
    locale: null,
    loading: false,
  };

  constructor(private readonly useCase: SettingsDemoUseCase) {}

  workspaceId(): string | null {
    return this.state.workspaceId;
  }

  themePreference(): 'system' | 'light' | 'dark' {
    return this.state.themePreference;
  }

  locale(): string | null {
    return this.state.locale;
  }

  loading(): boolean {
    return this.state.loading;
  }

  async initialize(): Promise<void> {
    this.state = await this.useCase.loadState();
  }

  async updateSettings(input: SettingsUpdateInput): Promise<void> {
    this.state = await this.useCase.updateSettings(input);
  }

  async resetSettings(input: SettingsResetInput): Promise<void> {
    this.state = await this.useCase.resetSettings(input);
  }
}
