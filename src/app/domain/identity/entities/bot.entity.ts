import type { IdentityId } from '../value-objects/identity-id.value-object';
import type { DisplayName } from '../value-objects/display-name.value-object';

/**
 * Bot represents a service identity with API key and permissions.
 * Domain entity according to STEP 3 requirements.
 */
export class Bot {
  readonly id: IdentityId;
  readonly type: 'bot' = 'bot';
  readonly name: DisplayName;
  readonly apiKey: string;
  readonly permissions: readonly string[];

  private constructor(props: {
    id: IdentityId;
    name: DisplayName;
    apiKey: string;
    permissions: readonly string[];
  }) {
    this.id = props.id;
    this.name = props.name;
    this.apiKey = props.apiKey;
    this.permissions = props.permissions;
  }

  static create(props: {
    id: IdentityId;
    name: DisplayName;
    apiKey: string;
    permissions?: readonly string[];
  }): Bot {
    return new Bot({
      id: props.id,
      name: props.name,
      apiKey: props.apiKey,
      permissions: props.permissions ?? [],
    });
  }

  /**
   * Check equality by identity id
   */
  equals(other: Bot): boolean {
    return this.id.equals(other.id);
  }
}
