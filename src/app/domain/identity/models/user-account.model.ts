export interface UserAccount {
  readonly id: string;
  readonly type: 'user';
  readonly workspaceIds?: string[];
}
