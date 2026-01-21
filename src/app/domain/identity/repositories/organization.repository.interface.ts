import type { Organization } from '../entities/organization.entity';

/**
 * OrganizationRepository defines the contract for organization persistence.
 */
export interface OrganizationRepository {
  getOrganizations(): Promise<Organization[]>;
  findById(organizationId: string): Promise<Organization | null>;
  save(organization: Organization): Promise<void>;
  delete(organizationId: string): Promise<void>;
}
