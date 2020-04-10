import { BaseBotSettings } from '../../framework/models/BotSettings';

export class BotSetting {
	public id: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public value: BaseBotSettings;
}
