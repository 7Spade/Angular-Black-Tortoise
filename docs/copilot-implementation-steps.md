# Copilot Browser Agent - 分步實施指令集

PR: https://github.com/7Spade/Angular-Black-Tortoise/pull/6
Spec: docs/integrated-system-spec.md

---

## STEP 1: Domain Shared Layer 基礎設施

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/shared/:

1. types/result.type.ts - Result monad with ok/fail methods
2. errors/domain.error.ts - DomainError, ValidationError, InvalidStateError, NotFoundError, UnauthorizedError
3. value-objects/timestamp.value-object.ts - Timestamp value object with create/now methods

Requirements:
- Pure TypeScript only
- No @angular/* imports
- No firebase/* imports
- No rxjs imports

Report completion only.
```

---

## STEP 2: Identity Bounded Context - Value Objects

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/identity/value-objects/:

1. identity-id.value-object.ts - IdentityId with UUID validation
2. email.value-object.ts - Email with RFC 5322 validation
3. display-name.value-object.ts - DisplayName with length validation (2-50 chars)
4. identity-status.value-object.ts - IdentityStatus enum ('active' | 'suspended' | 'deleted')

All must:
- Extend from domain/shared base types
- Use Result<T, ValidationError> pattern
- Be immutable
- Have static create() methods

Report completion only.
```

---

## STEP 3: Identity Bounded Context - Entities

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/identity/entities/:

1. user.entity.ts - User entity with id, email, displayName, status, createdAt
2. organization.entity.ts - Organization entity with id, ownerId, name, memberIds, teamIds, partnerIds
3. bot.entity.ts - Bot entity with id, name, apiKey, permissions

Requirements:
- Use identity value objects
- Implement equality by id
- Private constructors
- Static create() factory methods
- Immutable properties with readonly
- No framework dependencies

Report completion only.
```

---

## STEP 4: Identity Repository Interface

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/domain/identity/identity.repository.interface.ts

Define interface with these methods:
- findUserById(id: IdentityId): Promise<User | null>
- findUserByEmail(email: Email): Promise<User | null>
- saveUser(user: User): Promise<void>
- findOrganizationById(id: IdentityId): Promise<Organization | null>
- saveOrganization(org: Organization): Promise<void>
- findBotById(id: IdentityId): Promise<Bot | null>
- saveBot(bot: Bot): Promise<void>

Pure interface only. No implementation.

Report completion only.
```

---

## STEP 5: Workspace Bounded Context - Value Objects

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/workspace/value-objects/:

1. workspace-id.value-object.ts - WorkspaceId with UUID validation
2. workspace-owner.value-object.ts - WorkspaceOwner with ownerId + ownerType ('user' | 'organization')
3. workspace-quota.value-object.ts - WorkspaceQuota with maxModules, maxStorage limits
4. workspace-status.value-object.ts - WorkspaceStatus enum ('active' | 'archived' | 'deleted')
5. module-key.value-object.ts - ModuleKey with alphanumeric validation

All must follow Result<T, ValidationError> pattern.

Report completion only.
```

---

## STEP 6: Workspace Bounded Context - Entities

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/workspace/entities/:

1. workspace.entity.ts - Workspace with id, owner, name, status, quota, moduleIds, createdAt
2. workspace-module.entity.ts - WorkspaceModule with id, workspaceId, moduleKey, config

Requirements:
- Use workspace value objects
- Private constructors + static create()
- Immutable with readonly
- Business logic methods (activate, archive, addModule, removeModule)
- Return Result<T, DomainError> for state changes

Report completion only.
```

---

## STEP 7: Workspace Aggregate

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/domain/workspace/aggregates/workspace.aggregate.ts

WorkspaceAggregate that:
- Wraps Workspace entity
- Enforces consistency rules
- Manages WorkspaceModule collection
- Validates quota limits before adding modules
- Prevents modifications on archived/deleted workspaces
- Emits domain events (optional pattern for now)

Pure business logic only.

Report completion only.
```

---

## STEP 8: Workspace Repository Interface

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/domain/workspace/workspace.repository.interface.ts

Define interface with:
- findById(id: WorkspaceId): Promise<Workspace | null>
- findByOwner(owner: WorkspaceOwner): Promise<Workspace[]>
- save(workspace: Workspace): Promise<void>
- delete(id: WorkspaceId): Promise<void>
- findModules(workspaceId: WorkspaceId): Promise<WorkspaceModule[]>
- saveModule(module: WorkspaceModule): Promise<void>

Pure interface only.

Report completion only.
```

---

## STEP 9: Membership Bounded Context - Value Objects

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/membership/value-objects/:

1. membership-id.value-object.ts - MembershipId with UUID validation
2. role.value-object.ts - Role enum ('owner' | 'admin' | 'member' | 'viewer')
3. account-type.value-object.ts - AccountType enum ('user' | 'team' | 'partner')

Follow Result<T, ValidationError> pattern.

Report completion only.
```

---

## STEP 10: Membership Bounded Context - Entities

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/domain/membership/entities/:

1. team.entity.ts - Team with id, organizationId, name, memberIds (subset of org members)
2. partner.entity.ts - Partner with id, organizationId, name, memberIds (external users), contactEmail

Requirements:
- Use membership value objects
- Validate memberIds constraints in create()
- Team.memberIds must reference organization members
- Partner.memberIds must be external users
- Immutable with business logic methods

Report completion only.
```

---

## STEP 11: Membership Repository Interface

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/domain/membership/membership.repository.interface.ts

Define interface with:
- findTeamById(id: MembershipId): Promise<Team | null>
- findTeamsByOrganization(orgId: IdentityId): Promise<Team[]>
- saveTeam(team: Team): Promise<void>
- findPartnerById(id: MembershipId): Promise<Partner | null>
- findPartnersByOrganization(orgId: IdentityId): Promise<Partner[]>
- savePartner(partner: Partner): Promise<void>

Pure interface only.

Report completion only.
```

---

## STEP 12: Infrastructure - Firebase Repository Base

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/infrastructure/firebase/base-firebase.repository.ts

Abstract base class with:
- Protected firestore: Firestore injection
- Protected abstract collectionName: string
- Protected toFirestore(entity: T): any - abstract method
- Protected fromFirestore(data: any): T - abstract method
- Protected getDocRef(id: string): DocumentReference
- Protected getCollectionRef(): CollectionReference

Use @angular/fire/firestore.
This is infrastructure layer - framework dependencies allowed.

Report completion only.
```

---

## STEP 13: Infrastructure - Identity Repository Implementation

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/infrastructure/firebase/identity-firebase.repository.ts

Implement IdentityRepository interface from domain layer.

- Extend BaseFirebaseRepository
- Implement all methods from identity.repository.interface.ts
- Map domain entities to/from Firestore documents
- Use collections: 'users', 'organizations', 'bots'
- Handle null cases properly

Report completion only.
```

---

## STEP 14: Infrastructure - Workspace Repository Implementation

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/infrastructure/firebase/workspace-firebase.repository.ts

Implement WorkspaceRepository interface.

- Extend BaseFirebaseRepository
- Implement all methods from workspace.repository.interface.ts
- Handle workspace collection and modules subcollection
- Use collection group queries for findByOwner
- Map WorkspaceOwner value object correctly

Report completion only.
```

---

## STEP 15: Infrastructure - Membership Repository Implementation

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/infrastructure/firebase/membership-firebase.repository.ts

Implement MembershipRepository interface.

- Extend BaseFirebaseRepository
- Implement all methods from membership.repository.interface.ts
- Handle 'teams' and 'partners' collections
- Implement findByOrganization queries with indexes

Report completion only.
```

---

## STEP 16: Infrastructure - Repository Providers

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/infrastructure/firebase/repository.providers.ts

Export providers array with:
```typescript
export const REPOSITORY_PROVIDERS = [
  {
    provide: 'IdentityRepository',
    useClass: IdentityFirebaseRepository
  },
  {
    provide: 'WorkspaceRepository',
    useClass: WorkspaceFirebaseRepository
  },
  {
    provide: 'MembershipRepository',
    useClass: MembershipFirebaseRepository
  }
];
```

Report completion only.
```

---

## STEP 17: Application Layer - Identity Commands

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/application/identity/commands/:

1. create-user.command.ts - CreateUserCommand with email, displayName
2. create-organization.command.ts - CreateOrganizationCommand with ownerId, name
3. add-organization-member.command.ts - AddOrganizationMemberCommand

Each command handler:
- Inject repository via 'IdentityRepository' token
- Validate inputs
- Call domain logic
- Return Result<T, Error>
- Use @Injectable()

Report completion only.
```

---

## STEP 18: Application Layer - Identity Queries

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/application/identity/queries/:

1. get-user-by-id.query.ts - GetUserByIdQuery handler
2. get-user-organizations.query.ts - GetUserOrganizationsQuery handler
3. get-organization-members.query.ts - GetOrganizationMembersQuery handler

Each query handler:
- Inject repository
- Return DTOs not domain entities
- Use @Injectable()
- Handle null cases

Report completion only.
```

---

## STEP 19: Application Layer - Workspace Commands

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/application/workspace/commands/:

1. create-workspace.command.ts - CreateWorkspaceCommand with owner, name
2. add-workspace-module.command.ts - AddWorkspaceModuleCommand
3. archive-workspace.command.ts - ArchiveWorkspaceCommand

Follow same pattern as identity commands.
Use WorkspaceAggregate for business logic.

Report completion only.
```

---

## STEP 20: Application Layer - Workspace Queries

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/application/workspace/queries/:

1. get-workspace-by-id.query.ts
2. get-user-workspaces.query.ts - Get all workspaces accessible by user
3. get-workspace-modules.query.ts

Return workspace DTOs with:
```typescript
export interface WorkspaceDto {
  id: string;
  name: string;
  ownerType: 'user' | 'organization';
  status: string;
  createdAt: string;
}
```

Report completion only.
```

---

## STEP 21: Application Layer - Membership Commands

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/application/membership/commands/:

1. create-team.command.ts - CreateTeamCommand for organization teams
2. add-team-member.command.ts - AddTeamMemberCommand
3. create-partner.command.ts - CreatePartnerCommand for external collaborators

Validate constraints:
- Team members must be org members
- Partner members must be external

Report completion only.
```

---

## STEP 22: Application Layer - Membership Queries

```
EXECUTE NOW. NO DISCUSSION.

Create these files in src/app/application/membership/queries/:

1. get-organization-teams.query.ts
2. get-organization-partners.query.ts
3. get-team-members.query.ts

Return DTOs not domain entities.

Report completion only.
```

---

## STEP 23: Presentation Layer - Identity Store (ngrx/signals)

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/presentation/stores/identity.store.ts

Use signalStore from @ngrx/signals:

```typescript
export const IdentityStore = signalStore(
  { providedIn: 'root' },
  withState({
    currentUser: null as UserDto | null,
    currentIdentity: null as IdentityDto | null,
    organizations: [] as OrganizationDto[]
  }),
  withMethods((store, getUserQuery = inject(GetUserByIdQuery)) => ({
    async loadCurrentUser(userId: string) { /* ... */ },
    async switchIdentity(identityId: string) { /* ... */ }
  }))
);
```

Report completion only.
```

---

## STEP 24: Presentation Layer - Workspace Store

```
EXECUTE NOW. NO DISCUSSION.

Create file: src/app/presentation/stores/workspace.store.ts

Use signalStore with:
- State: workspaces, currentWorkspace, loading
- Methods: loadWorkspaces, switchWorkspace, createWorkspace

Inject workspace queries/commands.

Report completion only.
```

---

## STEP 25: Presentation Layer - Identity Switcher Component

```
EXECUTE NOW. NO DISCUSSION.

Create component: src/app/presentation/components/identity-switcher/

Files needed:
- identity-switcher.component.ts
- identity-switcher.component.html
- identity-switcher.component.scss

Requirements:
- Use Material 3 (mat-menu, mat-list, mat-icon)
- Inject IdentityStore
- Use @if / @for control flow (NO *ngIf / *ngFor)
- Show User + Organizations in list
- Show Teams/Partners as sub-sections under Organization
- Emit identityChanged event
- Standalone component

Report completion only.
```

---

## STEP 26: Presentation Layer - Workspace Switcher Component

```
EXECUTE NOW. NO DISCUSSION.

Create component: src/app/presentation/components/workspace-switcher/

Files needed:
- workspace-switcher.component.ts
- workspace-switcher.component.html
- workspace-switcher.component.scss

Requirements:
- Use Material 3 (mat-select, mat-form-field)
- Inject WorkspaceStore
- Use @if / @for control flow
- Group workspaces by source (Owned, Member, Team, Partner)
- Show workspace status badges
- Emit workspaceChanged event
- Standalone component

Report completion only.
```

---

## STEP 27: Presentation Layer - Top Navigation Component

```
EXECUTE NOW. NO DISCUSSION.

Create component: src/app/presentation/components/top-navigation/

Files needed:
- top-navigation.component.ts
- top-navigation.component.html
- top-navigation.component.scss

Requirements:
- Use Material 3 (mat-toolbar, mat-button)
- Embed identity-switcher component
- Embed workspace-switcher component
- Show user avatar
- Responsive layout (hide labels on mobile)
- Standalone component

Report completion only.
```

---

## STEP 28: Presentation Layer - Workspace Layout Component

```
EXECUTE NOW. NO DISCUSSION.

Create component: src/app/presentation/layouts/workspace-layout/

Files needed:
- workspace-layout.component.ts
- workspace-layout.component.html
- workspace-layout.component.scss

Requirements:
- Use Material 3 (mat-sidenav-container)
- Include top-navigation
- Provide router-outlet for module content
- Responsive sidebar
- Standalone component

Report completion only.
```

---

## STEP 29: Update App Routes

```
EXECUTE NOW. NO DISCUSSION.

Update src/app/app.routes.ts:

Add routes:
```typescript
{
  path: 'workspace/:id',
  component: WorkspaceLayoutComponent,
  children: [
    {
      path: ':module',
      loadComponent: () => import('./presentation/pages/module-host.component')
    }
  ]
}
```

Report completion only.
```

---

## STEP 30: Update App Config

```
EXECUTE NOW. NO DISCUSSION.

Update src/app/app.config.ts:

Add providers:
- importProvidersFrom(AngularFireModule.initializeApp(environment.firebase))
- importProvidersFrom(AngularFirestoreModule)
- ...REPOSITORY_PROVIDERS

Report completion only.
```

---

## VERIFICATION CHECKLIST

After all steps complete, verify:

- [ ] No @angular/* imports in domain/ layer
- [ ] All domain files use Result<T, Error> pattern
- [ ] All value objects are immutable
- [ ] Repository interfaces in domain, implementations in infrastructure
- [ ] All components use @if/@for (no *ngIf/*ngFor)
- [ ] All components are standalone
- [ ] ngrx/signals stores properly configured
- [ ] Material 3 components used throughout
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no errors

---

## FINAL COMMAND

```
VERIFY ALL FILES CREATED.
RUN: yarn lint
FIX ANY ERRORS.
REPORT FINAL STATUS.
```
