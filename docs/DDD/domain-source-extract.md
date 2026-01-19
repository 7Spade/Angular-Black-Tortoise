# Domain Layer 原始碼摘錄

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

此文件整理 `src/app/domain` 目前的實際原始碼內容，供查閱與比對。

## Account

### `src/app/domain/account/entities/auth-user.entity.ts`

```ts
// AuthStatus models the lifecycle of authentication state in the application.
export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

// AuthUser represents the authenticated identity snapshot used by the app.
export interface AuthUser {
  // Unique identifier provided by the auth provider.
  readonly id: string;
  // Primary email address used for authentication.
  readonly email: string;
  // Display name used in the UI when available.
  readonly displayName: string;
  // Profile photo URL when available.
  readonly photoUrl: string;
  // Whether the email address has been verified.
  readonly emailVerified: boolean;
}

// AuthCredentials capture the minimum data needed for password auth.
export interface AuthCredentials {
  // User email used to authenticate.
  readonly email: string;
  // Raw password used to authenticate.
  readonly password: string;
}

// AuthProfileUpdate models display/profile updates for the current user.
export interface AuthProfileUpdate {
  // Updated display name for the authenticated user.
  readonly displayName?: string;
  // Updated profile photo URL for the authenticated user.
  readonly photoUrl?: string;
}
```

### `src/app/domain/account/entities/identity.entity.ts`

```ts
// IdentityType is restricted to user, organization, and bot only.
export type IdentityType = 'user' | 'organization' | 'bot';

// WorkspaceOwnerType is restricted to user or organization for workspace ownership.
export type WorkspaceOwnerType = 'user' | 'organization';

// Base identity fields shared across identity entities.
interface IdentityBase {
  readonly id: string;
  readonly type: IdentityType;
}

// UserAccount represents a personal identity that can own workspaces.
export interface UserAccount extends IdentityBase {
  readonly type: 'user';
  readonly organizationIds: string[];
  readonly teamIds: string[];
  readonly partnerIds: string[];
  readonly workspaceIds: string[];
}

// OrganizationAccount represents an organization identity with member references.
export interface OrganizationAccount extends IdentityBase {
  readonly type: 'organization';
  readonly memberIds: string[];
  readonly teamIds: string[];
  readonly partnerIds: string[];
  readonly workspaceIds: string[];
}

// BotAccount represents a service identity without membership lists.
export interface BotAccount extends IdentityBase {
  readonly type: 'bot';
}

// IdentityAccount is a discriminated union of allowed identity entities.
export type IdentityAccount = UserAccount | OrganizationAccount | BotAccount;
```

## Membership

### `src/app/domain/membership/entities/membership.entity.ts`

```ts
// MembershipType is restricted to team and partner only.
export type MembershipType = 'team' | 'partner';

// Base membership fields shared across membership entities.
interface MembershipBase {
  readonly id: string;
  readonly type: MembershipType;
  readonly organizationId: string;
  readonly memberIds: string[];
}

// Team represents an internal organizational unit with member references.
export interface Team extends MembershipBase {
  readonly type: 'team';
}

// Partner represents an external organizational unit with member references.
export interface Partner extends MembershipBase {
  readonly type: 'partner';
}

// MembershipGroup is a discriminated union of team and partner entities.
export type MembershipGroup = Team | Partner;
```

## Modules

### `src/app/domain/modules/entities/workspace-module.entity.ts`

```ts
// WorkspaceModule represents a feature module attached to a workspace.
export interface WorkspaceModule {
  readonly id: string;
  readonly workspaceId: string;
  readonly moduleKey: string;
}
```

## Workspace

### `src/app/domain/workspace/entities/workspace.entity.ts`

```ts
import type { WorkspaceOwnerType } from '@domain/account/entities/identity.entity';

// Workspace represents a logical container owned by a user or organization only.
export interface Workspace {
  readonly id: string;
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
  readonly moduleIds: string[];
}
```

## Value Objects

目前 `src/app/domain` 內尚未建立 `value-objects` 目錄或值物件檔案；若後續新增，請在此補上對應的原始碼摘錄。
