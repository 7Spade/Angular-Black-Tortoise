# DDD Domain Layer Quick Reference

## Import Patterns

### ✅ Correct Usage

```typescript
// Entities
import { AuthUser } from '@domain/identity/entities/auth-user.entity';
import { User, Organization, Bot } from '@domain/identity';
import { Workspace } from '@domain/workspace';
import { WorkspaceModule } from '@domain/modules';

// Value Objects
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { WorkspaceId, WorkspaceOwner, WorkspaceQuota } from '@domain/workspace';
import { Email, Timestamp } from '@domain/shared';

// Aggregates
import { WorkspaceAggregate } from '@domain/workspace/aggregates/workspace.aggregate';
import { OrganizationMembership } from '@domain/membership';

// Types
import type { IdentityType, WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { MembershipType } from '@domain/membership/membership.types';

// Repository Interfaces (in Domain)
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';

// Domain Services
import type { PermissionChecker, QuotaEnforcer } from '@domain/services';

// Enums
import { WorkspaceLifecycle } from '@domain/workspace/enums/workspace-lifecycle.enum';
import { MembershipRole, MembershipStatus } from '@domain/membership';
```

### ❌ Deprecated (Still Works but Avoid)

```typescript
// Old shared interfaces - deprecated
import type { AuthRepository } from '@shared/interfaces/auth-repository.interface';
import type { WorkspaceRepository } from '@shared/interfaces/workspace-repository.interface';
import type { IdentityRepository } from '@shared/interfaces/identity-repository.interface';

// Old account path - removed, use identity instead
import { AuthUser } from '@domain/account/entities/auth-user.entity'; // ❌ No longer exists
```

## Value Object Usage

### Creating Value Objects

```typescript
// Always use static create() factory
const id = IdentityId.create('user-123');
const email = Email.create('user@example.com');
const workspaceId = WorkspaceId.create('ws-456');

// Get the underlying value
const idString = id.getValue(); // 'user-123'
const emailString = email.getValue(); // 'user@example.com'

// Compare value objects
const id1 = IdentityId.create('abc');
const id2 = IdentityId.create('abc');
id1.equals(id2); // true

// Validation happens automatically
const invalidEmail = Email.create('invalid'); // ❌ Throws Error
```

### WorkspaceOwner Value Object

```typescript
import { WorkspaceOwner } from '@domain/workspace';

const owner = WorkspaceOwner.create('user-123', 'user');
owner.getOwnerId(); // 'user-123'
owner.getOwnerType(); // 'user'
owner.isUserOwned(); // true
owner.isOrganizationOwned(); // false
```

### WorkspaceQuota Value Object

```typescript
import { WorkspaceQuota } from '@domain/workspace';

const quota = WorkspaceQuota.create({
  maxMembers: 10,
  maxStorage: 5000000,
  maxProjects: 50,
});

quota.canAddMembers(5, 3); // true (5 + 3 <= 10)
quota.canAddMembers(9, 3); // false (9 + 3 > 10)
```

## Entity Usage

### Creating Entities

```typescript
import { User } from '@domain/identity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';

// Use static create() factory
const user = User.create({
  id: IdentityId.create('user-123'),
  organizationIds: ['org-1', 'org-2'],
  teamIds: [],
  partnerIds: [],
  workspaceIds: ['ws-1'],
});

// All properties are readonly
user.id; // IdentityId
user.organizationIds; // ReadonlyArray<string>
```

### AuthUser (Aggregate Root)

```typescript
import { AuthUser } from '@domain/identity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';

const authUser = AuthUser.create({
  id: IdentityId.create('uid'),
  email: Email.create('user@example.com'),
  emailVerified: true,
});

// Business methods
authUser.isEmailVerified(); // true
authUser.id.getValue(); // 'uid'
authUser.email.getValue(); // 'user@example.com'
```

## Aggregate Root Usage

### WorkspaceAggregate

```typescript
import { WorkspaceAggregate } from '@domain/workspace/aggregates/workspace.aggregate';
import { WorkspaceId, WorkspaceOwner, WorkspaceQuota } from '@domain/workspace';
import { WorkspaceLifecycle } from '@domain/workspace/enums/workspace-lifecycle.enum';

const workspace = WorkspaceAggregate.create({
  id: WorkspaceId.create('ws-123'),
  owner: WorkspaceOwner.create('user-456', 'user'),
  lifecycle: WorkspaceLifecycle.Active,
  quota: WorkspaceQuota.create({ maxMembers: 10, maxStorage: 5000000, maxProjects: 50 }),
  moduleIds: ['mod-1', 'mod-2'],
});

// Invariants enforced
workspace.isActive(); // true
workspace.canAddModule(); // Check against quota

// State transitions with validation
workspace.archive(); // Changes lifecycle to Archived
workspace.activate(); // Changes back to Active

// Attempting invalid transition
workspace.archive();
workspace.lifecycle = WorkspaceLifecycle.Deleted;
workspace.activate(); // ❌ Throws: Cannot activate a deleted workspace
```

### OrganizationMembership

```typescript
import { OrganizationMembership } from '@domain/membership';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { MembershipRole, MembershipStatus } from '@domain/membership';

const membership = OrganizationMembership.create({
  id: MembershipId.create('mem-123'),
  organizationId: 'org-456',
  userId: 'user-789',
  role: MembershipRole.Admin,
  status: MembershipStatus.Active,
});

// Business logic
membership.isActive(); // true
membership.isAdmin(); // true
```

## Repository Interface Implementation

### In Infrastructure Layer

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import type { AuthUser, AuthCredentials } from '@domain/identity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';

@Injectable()
export class AuthFirebaseRepository implements AuthRepository {
  authState(): Observable<AuthUser | null> {
    // Convert from Firebase User to domain AuthUser
    return this.firebaseAuth.user$.pipe(
      map(firebaseUser => {
        if (!firebaseUser) return null;
        return AuthUser.create({
          id: IdentityId.create(firebaseUser.uid),
          email: Email.create(firebaseUser.email),
          emailVerified: firebaseUser.emailVerified,
        });
      })
    );
  }
  
  // ... other methods
}
```

## Domain Service Usage (Interfaces Only)

```typescript
import type { PermissionChecker } from '@domain/services';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';

// Implementation would be in infrastructure layer
class PermissionCheckerImpl implements PermissionChecker {
  canAccessWorkspace(identityId: IdentityId, workspaceId: WorkspaceId): boolean {
    // Cross-aggregate permission logic
    return true;
  }
  
  canModifyWorkspace(identityId: IdentityId, workspaceId: WorkspaceId): boolean {
    return this.canAccessWorkspace(identityId, workspaceId) && /* additional checks */;
  }
  
  canDeleteWorkspace(identityId: IdentityId, workspaceId: WorkspaceId): boolean {
    return this.canModifyWorkspace(identityId, workspaceId) && /* ownership check */;
  }
}
```

## Type Guards

```typescript
import type { IdentityType, WorkspaceOwnerType } from '@domain/identity/identity.types';

function isWorkspaceOwnerType(type: IdentityType): type is WorkspaceOwnerType {
  return type === 'user' || type === 'organization';
}

const identityType: IdentityType = 'user';
if (isWorkspaceOwnerType(identityType)) {
  // TypeScript knows identityType is 'user' | 'organization'
  const owner = WorkspaceOwner.create('id', identityType); // ✓ Type-safe
}
```

## Common Patterns

### Infrastructure → Domain Mapping

```typescript
// Firebase DTO
interface FirebaseWorkspaceDoc {
  id: string;
  ownerId: string;
  ownerType: 'user' | 'organization';
  moduleIds: string[];
  // ... infrastructure fields
}

// Map to Domain Entity
function toDomainWorkspace(doc: FirebaseWorkspaceDoc): Workspace {
  return Workspace.create({
    id: WorkspaceId.create(doc.id),
    owner: WorkspaceOwner.create(doc.ownerId, doc.ownerType),
    moduleIds: doc.moduleIds,
  });
}
```

### Domain → DTO Mapping (for API responses)

```typescript
interface WorkspaceDTO {
  id: string;
  ownerId: string;
  ownerType: string;
  moduleCount: number;
}

function toDTO(workspace: Workspace): WorkspaceDTO {
  return {
    id: workspace.id.getValue(),
    ownerId: workspace.owner.getOwnerId(),
    ownerType: workspace.owner.getOwnerType(),
    moduleCount: workspace.moduleIds.length,
  };
}
```

## Testing Domain Entities

```typescript
import { AuthUser } from '@domain/identity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';

describe('AuthUser', () => {
  it('should create with valid data', () => {
    const authUser = AuthUser.create({
      id: IdentityId.create('test-id'),
      email: Email.create('test@example.com'),
      emailVerified: false,
    });
    
    expect(authUser.isEmailVerified()).toBe(false);
    expect(authUser.id.getValue()).toBe('test-id');
  });
  
  it('should reject invalid email', () => {
    expect(() => {
      AuthUser.create({
        id: IdentityId.create('test-id'),
        email: Email.create('invalid-email'),
        emailVerified: false,
      });
    }).toThrow('Invalid email format');
  });
});
```

## Key Rules

1. **Value Objects are immutable** - No setters, only getters
2. **Use factory methods** - Always use `static create()`, never `new`
3. **Validate in constructors** - Throw errors for invalid state
4. **Entities have identity** - Compare by ID, not by reference
5. **Aggregates enforce invariants** - Business rules in methods
6. **Domain is pure** - No Angular/RxJS/Firebase dependencies
7. **Repository interfaces in domain** - Implementations in infrastructure
8. **DTOs for boundaries** - Convert at application/infrastructure layers

## File Naming Convention

```
✓ user.entity.ts              - Entity
✓ identity-id.value-object.ts - Value Object
✓ workspace.aggregate.ts      - Aggregate Root
✓ membership-role.enum.ts     - Enum
✓ auth.repository.interface.ts- Repository Interface
✓ identity.types.ts           - Union Types
✓ permission-checker.service.interface.ts - Domain Service
```
