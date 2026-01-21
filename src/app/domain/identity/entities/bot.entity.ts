import type { BotId } from '../value-objects/bot-id.value-object';

/**
 * Bot represents a service identity without membership lists.
 * Minimal domain entity without UI-specific fields.
 */
export class Bot {
  readonly id: BotId;
  readonly type: 'bot' = 'bot';

  private constructor(props: { id: BotId }) {
    this.id = props.id;
  }

  static create(props: { id: BotId }): Bot {
    return new Bot(props);
  }
}
