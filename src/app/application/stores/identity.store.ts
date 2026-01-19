import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { Bot } from '@domain/identity/entities/bot.entity';
import type { Organization } from '@domain/identity/entities/organization.entity';
import type { User } from '@domain/identity/entities/user.entity';
import type { Partner } from '@domain/membership/entities/partner.entity';
import type { Team } from '@domain/membership/entities/team.entity';
import { AppEventBus } from '@application/event-bus/app-event-bus.service';
import {
  IDENTITY_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
} from '@application/tokens/repository.tokens';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type {
  UserViewModel,
  OrganizationViewModel,
  TeamViewModel,
  PartnerViewModel,
} from '@application/view-models/identity.view-models';

export interface IdentityState {
  // Domain entities (internal)
  _users: User[];
  _organizations: Organization[];
  _bots: Bot[];
  _teams: Team[];
  _partners: Partner[];
  activeWorkspaceOwner: {
    ownerId: string;
    ownerType: WorkspaceOwnerType;
  } | null;
  // UI-specific data (temporary mock data until real repository implementation)
  currentUser: UserViewModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: IdentityState = {
  _users: [],
  _organizations: [],
  _bots: [],
  _teams: [],
  _partners: [],
  activeWorkspaceOwner: null,
  // Mock current user for UI development
  currentUser: {
    id: 'mock-user-1',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    type: 'user',
    organizationIds: ['org-1'],
    teamIds: [],
    partnerIds: [],
    workspaceIds: ['workspace-1']
  },
  loading: false,
  error: null,
};

// Mapper functions from domain entities to ViewModels
function mapUserToViewModel(user: User): UserViewModel {
  return {
    id: user.id.getValue(),
    displayName: user.displayName?.getValue() || null,
    email: user.email.getValue(),
    type: 'user',
    organizationIds: [],
    teamIds: [],
    partnerIds: [],
    workspaceIds: []
  };
}

function mapOrganizationToViewModel(org: Organization): OrganizationViewModel {
  return {
    id: org.id.getValue(),
    name: org.name.getValue(),
    ownerId: org.ownerId.getValue(),
    type: 'organization',
    memberIds: org.memberIds,
    teamIds: org.teamIds,
    partnerIds: org.partnerIds
  };
}

function mapTeamToViewModel(team: Team): TeamViewModel {
  return {
    id: team.id.getValue(),
    name: team.name,
    organizationId: team.organizationId,
    type: 'team',
    memberIds: Array.from(team.memberIds)
  };
}

function mapPartnerToViewModel(partner: Partner): PartnerViewModel {
  return {
    id: partner.id.getValue(),
    name: partner.name,
    organizationId: partner.organizationId,
    type: 'partner',
    memberIds: Array.from(partner.memberIds)
  };
}

export const IdentityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ _users, _organizations, _bots, _teams, _partners, activeWorkspaceOwner }) => ({
    // Public ViewModels for UI consumption
    users: computed(() => _users().map(mapUserToViewModel)),
    organizations: computed(() => _organizations().map(mapOrganizationToViewModel)),
    bots: computed(() => _bots()), // Bots don't need mapping - keep as entities for now
    teams: computed(() => _teams().map(mapTeamToViewModel)),
    partners: computed(() => _partners().map(mapPartnerToViewModel)),
    hasWorkspaceOwner: computed(() => activeWorkspaceOwner() !== null),
    organizationCount: computed(() => _organizations().length),
  })),
  withMethods(
    (
      store,
      repository = inject<IdentityRepository>(IDENTITY_REPOSITORY),
      membershipRepository = inject<MembershipRepository>(MEMBERSHIP_REPOSITORY),
      eventBus = inject(AppEventBus),
    ) => ({
      selectWorkspaceOwner(ownerType: WorkspaceOwnerType, ownerId: string): void {
        const selection = { ownerId, ownerType };
        patchState(store, { activeWorkspaceOwner: selection });
        eventBus.emit({
          type: 'workspace-owner-selected',
          payload: selection,
        });
      },
      loadUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(() => repository.getUsers()),
          tapResponse({
            next: (users) => patchState(store, { _users: users, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadOrganizations: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(() => repository.getOrganizations()),
          tapResponse({
            next: (organizations) =>
              patchState(store, { _organizations: organizations, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadBots: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(() => repository.getBots()),
          tapResponse({
            next: (bots) => patchState(store, { _bots: bots, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadTeams: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap((organizationId) =>
            membershipRepository.getTeams(organizationId),
          ),
          tapResponse({
            next: (teams) => patchState(store, { _teams: teams, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadPartners: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap((organizationId) =>
            membershipRepository.getPartners(organizationId),
          ),
          tapResponse({
            next: (partners) => patchState(store, { _partners: partners, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
    }),
  ),
);
