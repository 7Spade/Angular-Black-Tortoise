import type { Organization } from '../entities/organization.entity';
import type { OrganizationId } from '../value-objects/organization-id.value-object';

/**
 * OrganizationRepository defines the contract for organization persistence.
 */
export interface OrganizationRepository {
  findById(organizationId: OrganizationId): Promise<Organization | null>;
  save(organization: Organization): Promise<void>;
  delete(organizationId: OrganizationId): Promise<void>;
}
