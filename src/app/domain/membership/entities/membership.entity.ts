// MembershipType is restricted to team and partner only.
export type MembershipType = 'team' | 'partner';

// Base membership fields shared across membership entities.
interface MembershipBase {
  readonly id: string;
  readonly type: MembershipType;
  readonly organizationId: string;
  readonly memberIds: string[];
}

// Team represents an internal organizational unit with member references.
export interface Team extends MembershipBase {
  readonly type: 'team';
}

// Partner represents an external organizational unit with member references.
export interface Partner extends MembershipBase {
  readonly type: 'partner';
}

// MembershipGroup is a discriminated union of team and partner entities.
export type MembershipGroup = Team | Partner;
