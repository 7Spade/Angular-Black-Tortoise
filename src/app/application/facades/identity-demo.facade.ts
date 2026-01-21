import { Injectable, computed, signal } from '@angular/core';
import {
  IdentityDemoUseCase,
  IdentitySelectionInput,
  IdentityAccessCheckInput,
  IdentityDemoState,
  IdentityAccessResult,
} from '@application/use-cases/demo/identity-demo.use-case';

@Injectable({ providedIn: 'root' })
export class IdentityDemoFacade {
  private readonly state = signal<IdentityDemoState>({
    currentIdentityId: null,
    identityType: null,
    loading: false,
  });

  readonly currentIdentityId = computed(() => this.state().currentIdentityId);
  readonly identityType = computed(() => this.state().identityType);
  readonly loading = computed(() => this.state().loading);

  constructor(private readonly useCase: IdentityDemoUseCase) {}

  async initialize(): Promise<void> {
    this.state.set(await this.useCase.loadState());
  }

  async selectIdentity(input: IdentitySelectionInput): Promise<void> {
    this.state.set(await this.useCase.selectIdentity(input));
  }

  async checkAccess(
    input: IdentityAccessCheckInput,
  ): Promise<IdentityAccessResult> {
    return this.useCase.checkAccess(input);
  }
}
