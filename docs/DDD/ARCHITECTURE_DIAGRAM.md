# DDD Architecture Diagram

## Layer Structure

```
┌────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                           │
│                       (UI & User Interaction)                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 presentation/                                                   │
│     ├── 📄 app.component.ts          Root Component                │
│     ├── 📄 app.routes.ts             Route Configuration           │
│     ├── 📁 pages/                    Page Components               │
│     │   ├── auth/                    Authentication Pages          │
│     │   ├── dashboard/               Dashboard Page                │
│     │   └── home/                    Home Page                     │
│     ├── 📁 layouts/                  Layout Components (new)       │
│     ├── 📁 features/                 Feature Components (new)      │
│     └── 📁 shared/                   Shared UI Components (new)    │
│                                                                     │
│  Dependencies: @application layer (stores, guards)                 │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
                              ⬇ uses
┌────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│                  (Orchestration & State Management)                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 application/                                                    │
│     ├── 📁 stores/                   Signal Stores                 │
│     │   ├── auth.store.ts            Authentication State          │
│     │   ├── identity.store.ts        Identity State                │
│     │   └── workspace.store.ts       Workspace State               │
│     ├── 📁 guards/                   Route Guards ✨               │
│     │   └── auth.guard.ts            Auth Guard                    │
│     ├── 📁 event-bus/                Event Bus Service             │
│     │   └── app-event-bus.service.ts Event Coordination            │
│     ├── 📁 tokens/                   DI Tokens                     │
│     │   └── repository.tokens.ts     Injection Tokens              │
│     ├── 📁 services/                 App Services (new) ✨         │
│     └── 📁 mappers/                  Domain ↔ DTO (new) ✨         │
│                                                                     │
│  Dependencies: @domain layer (entities, repositories)              │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
                              ⬇ uses
┌────────────────────────────────────────────────────────────────────┐
│                          DOMAIN LAYER                               │
│                    (Business Logic & Rules)                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 domain/                                                         │
│     ├── 📁 identity/                 Identity Bounded Context      │
│     │   ├── entities/                User, Organization, Bot       │
│     │   ├── value-objects/           IdentityId, Profile           │
│     │   └── repositories/            Identity Repository Interface │
│     ├── 📁 membership/               Membership Bounded Context    │
│     │   ├── entities/                Team, Partner, Membership     │
│     │   ├── value-objects/           MembershipId, Permissions     │
│     │   └── repositories/            Membership Repository         │
│     ├── 📁 workspace/                Workspace Bounded Context     │
│     │   ├── entities/                Workspace Entity              │
│     │   ├── value-objects/           WorkspaceId, Quota, Owner     │
│     │   ├── aggregates/              Workspace Aggregate           │
│     │   └── repositories/            Workspace Repository          │
│     ├── 📁 modules/                  Module Bounded Context        │
│     │   ├── entities/                WorkspaceModule Entity        │
│     │   ├── value-objects/           ModuleId, Permissions         │
│     │   └── repositories/            Module Repository             │
│     ├── 📁 services/                 Domain Services               │
│     │   ├── permission-checker.service.interface.ts                │
│     │   └── quota-enforcer.service.interface.ts                    │
│     └── 📁 shared/                   Shared Domain Primitives      │
│         ├── value-objects/           Email, Slug, Timestamp        │
│         ├── errors/                  Domain Errors                 │
│         └── interfaces/              Common Interfaces             │
│                                                                     │
│  Dependencies: NONE (Pure Domain Logic)                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
                              ⬆ implemented by
┌────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                           │
│                  (External Systems & Adapters)                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 infrastructure/                                                 │
│     ├── 📁 repositories/             Repository Implementations    │
│     │   ├── auth-angularfire.repository.ts  Firebase Auth          │
│     │   ├── identity-firestore.repository.ts Identity Store        │
│     │   ├── membership-firestore.repository.ts Membership Store    │
│     │   ├── module-firestore.repository.ts Module Store            │
│     │   └── workspace-firestore.repository.ts Workspace Store      │
│     ├── 📁 firebase/                 Firebase Integration ✨       │
│     │   ├── converters/              Firestore Converters (new)    │
│     │   └── config/                  Firebase Config (new)         │
│     ├── 📁 collections/              Firestore Collections         │
│     │   └── collection-names.ts      Collection Constants          │
│     ├── 📁 mappers/                  Firestore Mappers ✨          │
│     │   └── firestore-mappers.ts     Type Converters               │
│     └── 📁 dto/                      Data Transfer Objects (new) ✨│
│                                                                     │
│  Dependencies: @domain layer (implements interfaces)               │
│                External: Firebase, Firestore, AngularFire          │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
┌─────────────┐
│Presentation │──────┐
└─────────────┘      │
                     ▼
              ┌─────────────┐
              │ Application │──────┐
              └─────────────┘      │
                                   ▼
                            ┌─────────────┐
                            │   Domain    │◀──────┐
                            └─────────────┘       │
                                                  │
                            ┌─────────────────────┘
                            │ Infrastructure │
                            └────────────────┘
```

### Rules
- **Presentation** can use **Application** (stores, guards)
- **Application** can use **Domain** (entities, interfaces)
- **Infrastructure** implements **Domain** (repository interfaces)
- **Domain** has NO dependencies (pure business logic)

## Clean Architecture Compliance

### ✅ Dependency Rule
**Inner layers NEVER depend on outer layers**
- Domain: 0 dependencies ✅
- Application: depends only on Domain ✅
- Infrastructure: implements Domain interfaces ✅
- Presentation: depends on Application ✅

### ✅ Stable Dependencies Principle
**Dependencies point toward stability**
- Domain = Most Stable (no dependencies)
- Application = Depends on stable Domain
- Infrastructure = Implements stable Domain
- Presentation = Uses stable Application

### ✅ Inversion of Control
**Abstractions owned by consumers**
- Domain defines repository interfaces
- Infrastructure provides implementations
- Application injects via DI tokens

## Key Improvements from Restructuring

### Before
```
infrastructure/
  ├── guards/              ❌ Wrong layer (cross-cutting concern)
  └── utils/               ❌ Ambiguous (what kind of utils?)
```

### After
```
application/
  └── guards/              ✅ Correct layer (app orchestration)

infrastructure/
  └── mappers/             ✅ Clear purpose (Firestore ↔ Domain)
```

## Layer Responsibilities

### Presentation Layer
**What:** UI components, templates, styles, routing
**Why:** User interaction and display logic
**Dependencies:** Application layer (stores, guards)
**Examples:**
- Components that display data
- Route definitions
- Layout components
- Feature-specific UI

### Application Layer
**What:** Orchestration, state management, coordination
**Why:** Connect domain logic to infrastructure and presentation
**Dependencies:** Domain layer (entities, interfaces)
**Examples:**
- Signal stores (auth, workspace, identity)
- Route guards (authorization)
- Event bus (cross-cutting events)
- Application services (use cases)

### Domain Layer
**What:** Business logic, entities, rules, invariants
**Why:** Core business value and rules
**Dependencies:** NONE
**Examples:**
- Entities (User, Workspace, Organization)
- Value Objects (Email, IdentityId, WorkspaceQuota)
- Aggregates (Workspace with validation)
- Repository interfaces (contracts)

### Infrastructure Layer
**What:** External systems, adapters, implementations
**Why:** Connect to databases, APIs, external services
**Dependencies:** Domain layer (implements interfaces)
**Examples:**
- Firebase/Firestore integration
- Repository implementations
- Converters (Firestore ↔ Domain)
- DTOs for external systems

---
*Generated: January 19, 2025*
*Clean Architecture: ✅ Compliant*
*DDD Patterns: ✅ Applied*
