import type { Bot } from '../entities/bot.entity';

/**
 * BotRepository defines the contract for bot persistence.
 */
export interface BotRepository {
  getBots(): Promise<Bot[]>;
  findById(botId: string): Promise<Bot | null>;
  save(bot: Bot): Promise<void>;
  delete(botId: string): Promise<void>;
}
