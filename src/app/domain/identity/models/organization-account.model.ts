export interface OrganizationAccount {
  readonly id: string;
  readonly type: 'organization';
  readonly memberIds: string[];
  readonly workspaceIds?: string[];
}
