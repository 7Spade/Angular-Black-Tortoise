import {
  IdentityDemoUseCase,
  IdentitySelectionInput,
  IdentityAccessCheckInput,
  IdentityDemoState,
  IdentityAccessResult,
} from '@application/use-cases/demo/identity-demo.use-case';

export class IdentityDemoFacade {
  private state: IdentityDemoState = {
    currentIdentityId: null,
    identityType: null,
    loading: false,
  };

  constructor(private readonly useCase: IdentityDemoUseCase) {}

  currentIdentityId(): string | null {
    return this.state.currentIdentityId;
  }

  identityType(): 'user' | 'organization' | 'bot' | null {
    return this.state.identityType;
  }

  loading(): boolean {
    return this.state.loading;
  }

  async initialize(): Promise<void> {
    this.state = await this.useCase.loadState();
  }

  async selectIdentity(input: IdentitySelectionInput): Promise<void> {
    this.state = await this.useCase.selectIdentity(input);
  }

  async checkAccess(
    input: IdentityAccessCheckInput,
  ): Promise<IdentityAccessResult> {
    return this.useCase.checkAccess(input);
  }
}
