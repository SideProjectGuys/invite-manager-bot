import { Embed, Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import {
	EnumResolver,
	SettingsValueResolver
} from '../../../../framework/resolvers';
import { botSettings, BotSettingsKey, LogAction } from '../../../../sequelize';
import { beautify, botSettingsInfo } from '../../../../settings';
import { BotCommand, CommandGroup } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.botConfig,
			aliases: ['bot-config', 'botSetting', 'bot-setting'],
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(BotSettingsKey))
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, botSettingsInfo),
					rest: true
				}
			],
			group: CommandGroup.Config,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[key, value]: [BotSettingsKey, any],
		flags: {},
		context: Context
	): Promise<any> {
		const { guild, t } = context;

		if (this.client.type !== 'custom') {
			this.sendReply(
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
			Object.keys(botSettingsInfo).forEach((k: BotSettingsKey) => {
				const inf = botSettingsInfo[k];
				if (!configs[inf.grouping[0]]) {
					configs[inf.grouping[0]] = [];
				}
				configs[inf.grouping[0]].push('`' + k + '`');
			});

			Object.keys(configs).forEach(group => {
				embed.description +=
					`**${group}**\n` + configs[group].join(', ') + '\n\n';
			});

			return this.sendReply(message, embed);
		}

		const info = botSettingsInfo[key];
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
					value: beautify(info, oldVal)
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
				return this.sendReply(
					message,
					t('cmd.botConfig.canNotClear', { prefix, key })
				);
			}
		} else {
			// Only validate the config setting if we're not resetting or clearing it
			const error = this.validate(key, value, context);
			if (error) {
				return this.sendReply(message, error);
			}
		}

		// Set new value (we override the local value, because the formatting probably changed)
		// If the value didn't change, then it will now be equal to oldVal (and also have the same formatting)
		this.client.settings[key] = value;
		await botSettings.bulkCreate(
			[
				{
					id: this.client.user.id,
					value: this.client.settings
				}
			],
			{
				updateOnDuplicate: ['value', 'updatedAt']
			}
		);
		this.client.setActivity();

		if (value === oldVal) {
			embed.description = t('cmd.botConfig.sameValue');
			embed.fields.push({
				name: t('cmd.botConfig.current.title'),
				value: beautify(info, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.botConfig.changed.text', { prefix, key });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null && oldVal !== undefined) {
			embed.fields.push({
				name: t('cmd.botConfig.previous.title'),
				value: beautify(info, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.botConfig.new.title'),
			value: value !== null ? beautify(info, value) : t('cmd.botConfig.none')
		});

		// Do any post processing, such as example messages
		const cb = await this.after(message, embed, key, value, context);

		await this.sendReply(message, embed);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		key: BotSettingsKey,
		value: any,
		{ t, me }: Context
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		if (key === BotSettingsKey.activityUrl) {
			const url = value as string;
			if (!url.startsWith('https://twitch.tv/')) {
				return t('cmd.botConfig.invalid.twitchOnly');
			}
		}

		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		message: Message,
		embed: Embed,
		key: BotSettingsKey,
		value: any,
		context: Context
	): Promise<Function> {
		return;
	}
}
