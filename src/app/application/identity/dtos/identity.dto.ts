import type { IdentityStatusValue } from '@domain/identity/value-objects/identity-status.value-object';

/**
 * UserDto - Data Transfer Object for User
 * Reflects the actual User entity properties (no foreign key arrays)
 */
export interface UserDto {
  id: string;
  type: 'user';
  email: string;
  displayName: string;
  status: IdentityStatusValue;
  createdAt: string;
}

/**
 * OrganizationDto - Data Transfer Object for Organization
 * Reflects the actual Organization entity properties
 */
export interface OrganizationDto {
  id: string;
  type: 'organization';
  ownerId: string;
  name: string;
  memberIds: string[];
  teamIds: string[];
  partnerIds: string[];
}

/**
 * BotDto - Data Transfer Object for Bot
 */
export interface BotDto {
  id: string;
  type: 'bot';
  organizationId: string;
}

/**
 * IdentityDto - Union type for all identity types
 */
export type IdentityDto = UserDto | OrganizationDto | BotDto;
