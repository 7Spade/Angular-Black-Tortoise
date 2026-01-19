/**
 * TeamDto - Data Transfer Object for Team
 */
export interface TeamDto {
  id: string;
  organizationId: string;
  memberIds: string[];
}

/**
 * PartnerDto - Data Transfer Object for Partner
 */
export interface PartnerDto {
  id: string;
  organizationId: string;
  memberIds: string[];
}
