export interface Partner {
  readonly id: string;
  readonly type: 'partner';
  readonly organizationId: string;
  readonly memberIds: string[];
}
