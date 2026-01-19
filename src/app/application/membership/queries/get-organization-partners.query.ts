import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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

  execute(organizationId: string): Observable<PartnerDto[]> {
    return this.repository.getPartners(organizationId).pipe(
      map((partners) =>
        partners.map((partner) => ({
          id: partner.id.getValue(),
          organizationId: partner.organizationId.getValue(),
          memberIds: [...partner.memberIds],
        }))
      )
    );
  }
}
