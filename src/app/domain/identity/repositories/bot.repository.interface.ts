import type { Bot } from '../entities/bot.entity';
import type { BotId } from '../value-objects/bot-id.value-object';

/**
 * BotRepository defines the contract for bot persistence.
 */
export interface BotRepository {
  findById(botId: BotId): Promise<Bot | null>;
  save(bot: Bot): Promise<void>;
  delete(botId: BotId): Promise<void>;
}
