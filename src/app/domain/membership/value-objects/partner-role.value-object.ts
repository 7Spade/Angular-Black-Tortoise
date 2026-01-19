/**
 * PartnerRole is a value object representing roles within a partner organization.
 * Valid roles: Partner Admin, Collaborator
 */
export class PartnerRole {
  private readonly value: 'partner-admin' | 'collaborator';

  private constructor(value: 'partner-admin' | 'collaborator') {
    this.value = value;
  }

  static createPartnerAdmin(): PartnerRole {
    return new PartnerRole('partner-admin');
  }

  static createCollaborator(): PartnerRole {
    return new PartnerRole('collaborator');
  }

  static fromString(value: string): PartnerRole {
    const normalized = value.toLowerCase().trim();
    if (normalized === 'partner-admin' || normalized === 'partneradmin' || normalized === 'admin') {
      return PartnerRole.createPartnerAdmin();
    }
    if (normalized === 'collaborator') {
      return PartnerRole.createCollaborator();
    }
    throw new Error(`Invalid partner role: ${value}. Must be one of: partner-admin, collaborator`);
  }

  isPartnerAdmin(): boolean {
    return this.value === 'partner-admin';
  }

  isCollaborator(): boolean {
    return this.value === 'collaborator';
  }

  canManagePartner(): boolean {
    return this.value === 'partner-admin';
  }

  getValue(): 'partner-admin' | 'collaborator' {
    return this.value;
  }

  equals(other: PartnerRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
