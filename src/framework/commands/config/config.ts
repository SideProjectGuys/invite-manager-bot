import { Message } from 'eris';

import { IMClient } from '../../../client';
import { SettingsInfo } from '../../../types';
import { GuildSettingsCache } from '../../cache/GuildSettings';
import { Cache } from '../../decorators/Cache';
import { Service } from '../../decorators/Service';
import { Guild } from '../../models/Guild';
import { LogAction } from '../../models/Log';
import { EnumResolver, SettingsValueResolver } from '../../resolvers';
import { SettingsService } from '../../services/Settings';
import { CommandContext, IMCommand } from '../Command';

type AnySettings = { [key: string]: any };

export default class extends IMCommand {
	@Service() private settings: SettingsService;
	@Cache() private guildSettingsCache: GuildSettingsCache;

	private settingsInfos: Map<string, SettingsInfo<any>>;

	public constructor(client: IMClient) {
		super(client, {
			name: 'config',
			aliases: ['c'],
			args: [
				{
					name: 'key',
					resolver: null, // setup later
					required: true
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, Guild),
					rest: true
				}
			],
			group: 'Config',
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async init() {
		this.settingsInfos = this.settings.getSettingsInfos(Guild);
		this.args[0].resolver = new EnumResolver(this.client, [...this.settingsInfos.keys()]);

		await super.init();
	}

	public async action(
		message: Message,
		[key, value]: [string, any],
		flags: {},
		context: CommandContext<AnySettings>
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = this.createEmbed();

		const info = this.settingsInfos.get(key);
		const oldVal = settings[key];
		embed.title = key;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal !== null) {
				embed.description = t('cmd.config.current.text', {
					prefix,
					key
				});

				if (info.clearable) {
					embed.description +=
						'\n' +
						t('cmd.config.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.config.current.title'),
					value: this.settings.beautify(info.type, oldVal)
				});
			} else {
				embed.description = t('cmd.config.current.notSet', {
					prefix,
					key
				});
			}
			return this.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (!info.clearable) {
				return this.sendReply(message, t('cmd.config.canNotClear', { prefix, key }));
			}
		} else if ((value !== null || value !== undefined) && info.validate) {
			// Only validate the config setting if we're not resetting or clearing it
			const error = info.validate(key, value, context);

			if (error) {
				return this.sendReply(message, error);
			}
		}

		// Set new value (we override the local value, because the formatting probably changed)
		// If the value didn't change, then it will now be equal to oldVal (and also have the same formatting)
		value = await this.guildSettingsCache.setOne<AnySettings>(guild.id, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.config.sameValue');
			embed.fields.push({
				name: t('cmd.config.current.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.config.changed.text', { prefix, key });

		// Log the settings change
		await this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null && oldVal !== undefined) {
			embed.fields.push({
				name: t('cmd.config.previous.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.config.new.title'),
			value: value !== null ? this.settings.beautify(info.type, value) : t('cmd.config.none')
		});

		await this.sendReply(message, embed);
	}
}
