import { Embed, Message, User } from 'eris';

import { IMClient } from '../../client';
import {
	EnumResolver,
	SettingsValueResolver,
	UserResolver
} from '../../resolvers';
import {
	defaultMemberSettings,
	LogAction,
	MemberSettingsKey,
	memberSettingsTypes
} from '../../sequelize';
import { beautify, fromDbValue } from '../../settings';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.memberConfig,
			aliases: ['member-config', 'memconf', 'mc'],
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(MemberSettingsKey))
				},
				{
					name: 'user',
					resolver: UserResolver
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(
						client,
						memberSettingsTypes,
						defaultMemberSettings
					),
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
		[key, user, value]: [MemberSettingsKey, User, any],
		context: Context
	): Promise<any> {
		const { guild, t, settings } = context;
		const prefix = settings.prefix;
		const embed = this.client.createEmbed();

		if (!key) {
			embed.title = t('cmd.memberConfig.title');
			embed.description = t('cmd.memberConfig.text', { prefix });

			const keys = Object.keys(MemberSettingsKey);
			embed.fields.push({
				name: t('cmd.memberConfig.keys.title'),
				value: keys.join('\n')
			});

			return this.client.sendReply(message, embed);
		}

		if (!user) {
			const allSets = await this.client.cache.members.get(guild.id);
			if (allSets.size > 0) {
				allSets.forEach((set: any) =>
					embed.fields.push({
						name: set.memberName,
						value: fromDbValue(set.key, set.value)
					})
				);
			} else {
				embed.description = t('cmd.memberConfig.notSet');
			}
			return this.client.sendReply(message, embed);
		}

		let memSettings = await this.client.cache.members.getOne(guild.id, user.id);
		let oldVal = memSettings[key];
		embed.title = `${user.username}#${user.discriminator} - ${key}`;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal !== null) {
				embed.description = t('cmd.memberConfig.current.text', {
					prefix,
					key
				});

				if (defaultMemberSettings[key] === null ? 't' : undefined) {
					embed.description +=
						'\n' +
						t('cmd.memberConfig.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.memberConfig.current.title'),
					value: beautify(key, oldVal)
				});
			} else {
				embed.description = t('cmd.memberConfig.current.notSet', {
					prefix,
					key
				});
			}
			return this.client.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (defaultMemberSettings[key] !== null) {
				return this.client.sendReply(
					message,
					t('cmd.memberConfig.canNotClear', { prefix, key })
				);
			}
		} else {
			// Only validate the config setting if we're not resetting or clearing it
			const error = this.validate(key, value, context);
			if (error) {
				return this.client.sendReply(message, error);
			}
		}

		// Set new value (we override the local value, because the formatting probably changed)
		// If the value didn't change, then it will now be equal to oldVal (and also have the same formatting)
		value = await this.client.cache.members.setOne(guild.id, user, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.memberConfig.sameValue');
			embed.fields.push({
				name: t('cmd.memberConfig.current.title'),
				value: beautify(key, oldVal)
			});
			return this.client.sendReply(message, embed);
		}

		embed.description = t('cmd.memberConfig.changed.text', { prefix, key });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null) {
			embed.fields.push({
				name: t('cmd.memberConfig.previous.title'),
				value: beautify(key, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.memberConfig.new.title'),
			value: value !== null ? beautify(key, value) : t('cmd.memberConfig.none')
		});

		// Do any post processing, such as example messages
		const cb = await this.after(message, embed, key, value, context);

		await this.client.sendReply(message, embed);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		key: MemberSettingsKey,
		value: any,
		{ t, me }: Context
	): string | null {
		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		message: Message,
		embed: Embed,
		key: MemberSettingsKey,
		value: any,
		context: Context
	): Promise<Function> {
		return null;
	}
}
