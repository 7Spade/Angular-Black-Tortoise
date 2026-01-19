import { InjectionToken } from '@angular/core';
import type { IdentityRepository } from '@shared/interfaces/identity-repository.interface';
import type { WorkspaceRepository } from '@shared/interfaces/workspace-repository.interface';
import type { AuthRepository } from '@shared/interfaces/auth-repository.interface';

export const IDENTITY_REPOSITORY = new InjectionToken<IdentityRepository>(
  'IDENTITY_REPOSITORY',
);

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY',
);

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>(
  'AUTH_REPOSITORY',
);
