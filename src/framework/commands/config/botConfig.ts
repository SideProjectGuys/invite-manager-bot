import { Client, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandGroup, SettingsInfo } from '../../../types';
import { Service } from '../../decorators/Service';
import { BaseBotSettings } from '../../models/BotSettings';
import { LogAction } from '../../models/Log';
import { EnumResolver, SettingsValueResolver } from '../../resolvers';
import { SettingsService } from '../../services/Settings';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	@Service() private settings: SettingsService;

	private settingsInfos: Map<string, SettingsInfo<any>>;

	public constructor(client: IMClient) {
		super(client, {
			name: 'botConfig',
			aliases: ['bot-config', 'botSetting', 'bot-setting'],
			args: [
				{
					name: 'key',
					resolver: null // setup later
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, Client),
					rest: true
				}
			],
			group: CommandGroup.Config,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async init() {
		this.settingsInfos = this.settings.getSettingsInfos(Client);
		this.args[0].resolver = new EnumResolver(this.client, [...this.settingsInfos.keys()]);

		await super.init();
	}

	public async action(
		message: Message,
		[key, value]: [keyof BaseBotSettings, any],
		flags: {},
		context: CommandContext
	): Promise<any> {
		const { guild, t } = context;

		if (this.client.type !== 'custom') {
			await this.sendReply(
				message,
				t('cmd.botConfig.customOnly', {
					prefix: context.settings.prefix,
					patreon: this.client.config.bot.links.patreon
				})
			);
			return;
		}

		const settings = this.client.settings;

		const prefix = context.settings.prefix;
		const embed = this.createEmbed();

		if (!key) {
			embed.title = t('cmd.botConfig.title');
			embed.description = t('cmd.botConfig.text', { prefix }) + '\n\n';

			const configs: { [x: string]: string[] } = {};
			for (const [k, inf] of this.settingsInfos) {
				if (!configs[inf.grouping[0]]) {
					configs[inf.grouping[0]] = [];
				}
				configs[inf.grouping[0]].push('`' + k + '`');
			}

			Object.keys(configs).forEach((group) => {
				embed.description += `**${group}**\n` + configs[group].join(', ') + '\n\n';
			});

			return this.sendReply(message, embed);
		}

		const info = this.settingsInfos.get(key);
		const oldVal = settings[key];
		embed.title = key;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal !== null) {
				embed.description = t('cmd.botConfig.current.text', {
					prefix,
					key
				});

				if (info.clearable) {
					embed.description +=
						'\n' +
						t('cmd.botConfig.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.botConfig.current.title'),
					value: this.settings.beautify(info.type, oldVal)
				});
			} else {
				embed.description = t('cmd.botConfig.current.notSet', {
					prefix,
					key
				});
			}
			return this.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (!info.clearable) {
				return this.sendReply(message, t('cmd.botConfig.canNotClear', { prefix, key }));
			}
		} else if ((value !== null || value !== undefined) && info.validate) {
			// Only validate the config setting if we're not resetting or clearing it
			const error = info.validate(key, value, context);

			if (error) {
				return this.sendReply(message, error);
			}
		}

		// Set new value
		(this.client.settings[key] as any) = value;
		await this.settings.saveBotSettings({
			id: this.client.user.id,
			value: this.client.settings
		});
		await this.client.setActivity();

		if (value === oldVal) {
			embed.description = t('cmd.botConfig.sameValue');
			embed.fields.push({
				name: t('cmd.botConfig.current.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.botConfig.changed.text', { prefix, key });

		// Log the settings change
		await this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null && oldVal !== undefined) {
			embed.fields.push({
				name: t('cmd.botConfig.previous.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.botConfig.new.title'),
			value: value !== null ? this.settings.beautify(info.type, value) : t('cmd.botConfig.none')
		});

		await this.sendReply(message, embed);
	}
}
