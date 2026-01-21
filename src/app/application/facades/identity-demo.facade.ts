import { Injectable, inject, signal } from '@angular/core';
import {
  IdentityDemoUseCase,
  IdentitySelectionInput,
  IdentityAccessCheckInput,
  IdentityAccessResult,
} from '@application/use-cases/demo/identity-demo.use-case';

@Injectable({ providedIn: 'root' })
export class IdentityDemoFacade {
  private readonly useCase = inject(IdentityDemoUseCase);

  readonly currentIdentityId = signal<string | null>(null);
  readonly identityType = signal<'user' | 'organization' | 'bot' | null>(null);
  readonly loading = signal(false);

  async initialize(): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.loadState();
    this.currentIdentityId.set(state.currentIdentityId);
    this.identityType.set(state.identityType);
    this.loading.set(false);
  }

  async selectIdentity(input: IdentitySelectionInput): Promise<void> {
    this.loading.set(true);
    const state = await this.useCase.selectIdentity(input);
    this.currentIdentityId.set(state.currentIdentityId);
    this.identityType.set(state.identityType);
    this.loading.set(false);
  }

  async checkAccess(
    input: IdentityAccessCheckInput,
  ): Promise<IdentityAccessResult> {
    return this.useCase.checkAccess(input);
  }
}
