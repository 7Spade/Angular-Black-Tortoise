/**
 * UserDto - Data Transfer Object for User
 */
export interface UserDto {
  id: string;
  type: 'user';
  organizationIds: string[];
  teamIds: string[];
  partnerIds: string[];
  workspaceIds: string[];
}

/**
 * OrganizationDto - Data Transfer Object for Organization
 */
export interface OrganizationDto {
  id: string;
  type: 'organization';
  ownerId: string;
  memberIds: string[];
  teamIds: string[];
  partnerIds: string[];
  workspaceIds: string[];
}

/**
 * BotDto - Data Transfer Object for Bot
 */
export interface BotDto {
  id: string;
  type: 'bot';
  organizationId: string;
  workspaceIds: string[];
}

/**
 * IdentityDto - Union type for all identity types
 */
export type IdentityDto = UserDto | OrganizationDto | BotDto;
