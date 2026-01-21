import { Injectable, inject } from '@angular/core';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type { PartnerDto } from '../dtos/membership.dto';

/**
 * GetOrganizationPartnersQuery - Query handler to get partners for an organization
 */
@Injectable({ providedIn: 'root' })
export class GetOrganizationPartnersQuery {
  private readonly repository = inject<MembershipRepository>(
    'MembershipRepository' as any
  );

  async execute(organizationId: string): Promise<PartnerDto[]> {
    const partners = await this.repository.getPartners(organizationId);
    
    return partners.map((partner) => ({
      id: partner.id.getValue(),
      organizationId: partner.organizationId.getValue(),
      memberIds: [...partner.memberIds],
    }));
  }
}
