export interface Team {
  readonly id: string;
  readonly type: 'team';
  readonly organizationId: string;
  readonly memberIds: string[];
}
