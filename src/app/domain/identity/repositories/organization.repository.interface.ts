import type { Organization } from '../aggregates/organization.aggregate';
import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { OrganizationSlug } from '../value-objects/organization-slug.value-object';

/**
 * Repository interface for Organization aggregate.
 */
export interface OrganizationRepository {
  /**
   * Find organization by ID.
   * @param id - The organization ID
   * @returns Promise resolving to the organization or null if not found
   */
  findById(id: OrganizationId): Promise<Organization | null>;

  /**
   * Find organization by slug.
   * @param slug - The organization slug
   * @returns Promise resolving to the organization or null if not found
   */
  findBySlug(slug: OrganizationSlug): Promise<Organization | null>;

  /**
   * Save organization aggregate.
   * @param organization - The organization aggregate to save
   * @returns Promise resolving when save is complete
   */
  save(organization: Organization): Promise<void>;
}
