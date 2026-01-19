import type { PartnerId } from '../value-objects/partner-id.value-object';
import type { OrganizationId } from '../value-objects/organization-id.value-object';
import type { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * Internal token to restrict Partner entity construction to Organization aggregate.
 */
export const PARTNER_FACTORY_TOKEN = Symbol('PARTNER_FACTORY_TOKEN');

/**
 * Partner entity represents an external partner associated with an organization.
 * Can only be created by the Organization aggregate.
 */
export class Partner {
  readonly id: PartnerId;
  readonly organizationId: OrganizationId;
  readonly memberIds: ReadonlyArray<IdentityId>;

  private constructor(
    token: symbol,
    props: {
      id: PartnerId;
      organizationId: OrganizationId;
      memberIds: ReadonlyArray<IdentityId>;
    }
  ) {
    if (token !== PARTNER_FACTORY_TOKEN) {
      throw new Error('Partner can only be created by Organization aggregate');
    }
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.memberIds = props.memberIds;
  }

  /**
   * Factory method for Organization aggregate use only.
   */
  static createForAggregate(
    token: symbol,
    props: {
      id: PartnerId;
      organizationId: OrganizationId;
      memberIds: ReadonlyArray<IdentityId>;
    }
  ): Partner {
    return new Partner(token, props);
  }
}
