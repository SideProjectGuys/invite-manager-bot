import { BaseGuildSettings } from '../../framework/models/GuildSettings';

export class GuildSetting {
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public value: BaseGuildSettings;
}
