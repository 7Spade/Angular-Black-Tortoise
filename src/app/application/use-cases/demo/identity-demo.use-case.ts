export interface IdentityDemoState {
  readonly currentIdentityId: string | null;
  readonly identityType: 'user' | 'organization' | 'bot' | null;
  readonly loading: boolean;
}

export interface IdentitySelectionInput {
  readonly identityId: string;
  readonly identityType: 'user' | 'organization' | 'bot';
}

export interface IdentityAccessCheckInput {
  readonly identityId: string;
  readonly capability: 'read' | 'write' | 'admin';
}

export interface IdentityAccessResult {
  readonly allowed: boolean;
}

@Injectable({ providedIn: 'root' })
export class IdentityDemoUseCase {
  async loadState(): Promise<IdentityDemoState> {
    return {
      currentIdentityId: null,
      identityType: null,
      loading: false,
    };
  }

  async selectIdentity(
    input: IdentitySelectionInput,
  ): Promise<IdentityDemoState> {
    return {
      currentIdentityId: input.identityId,
      identityType: input.identityType,
      loading: false,
    };
  }

  async checkAccess(
    input: IdentityAccessCheckInput,
  ): Promise<IdentityAccessResult> {
    const allowed = input.identityId.trim().length > 0;
    return { allowed };
  }
}
