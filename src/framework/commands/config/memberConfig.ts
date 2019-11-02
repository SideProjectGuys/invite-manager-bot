import { Embed, Message } from 'eris';

import { IMClient } from '../../../client';
import { beautify, memberSettingsInfo } from '../../../settings';
import { BasicUser, BotCommand, CommandGroup } from '../../../types';
import { LogAction } from '../../models/Log';
import { MemberSettingsKey } from '../../models/MemberSetting';
import { EnumResolver, SettingsValueResolver, UserResolver } from '../../resolvers';
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
					resolver: new SettingsValueResolver(client, memberSettingsInfo),
					rest: true
				}
			],
			group: CommandGroup.Config,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[key, user, value]: [MemberSettingsKey, BasicUser, any],
		flags: {},
		context: Context
	): Promise<any> {
		const { guild, t, settings } = context;
		const prefix = settings.prefix;
		const embed = this.createEmbed();

		if (!key) {
			embed.title = t('cmd.memberConfig.title');
			embed.description = t('cmd.memberConfig.text', { prefix });

			const keys = Object.keys(MemberSettingsKey);
			embed.fields.push({
				name: t('cmd.memberConfig.keys.title'),
				value: keys.join('\n')
			});

			return this.sendReply(message, embed);
		}

		const info = memberSettingsInfo[key];

		if (!user) {
			const allSets = await this.client.cache.members.get(guild.id);
			if (allSets.size > 0) {
				allSets.forEach((set, memberId) =>
					embed.fields.push({
						name: guild.members.get(memberId).username,
						value: beautify(info.type, set[key])
					})
				);
			} else {
				embed.description = t('cmd.memberConfig.notSet');
			}
			return this.sendReply(message, embed);
		}

		const memSettings = await this.client.cache.members.getOne(guild.id, user.id);
		const oldVal = memSettings[key];
		embed.title = `${user.username}#${user.discriminator} - ${key}`;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal) {
				embed.description = t('cmd.inviteCodeConfig.current.text', {
					prefix,
					key
				});

				if (info.clearable) {
					embed.description +=
						'\n' +
						t('cmd.inviteCodeConfig.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.inviteCodeConfig.current.title'),
					value: beautify(info.type, oldVal)
				});
			} else {
				embed.description = t('cmd.memberConfig.current.notSet', {
					prefix,
					key
				});
			}
			return this.sendReply(message, embed);
		}

		if (value === null) {
			if (!info.clearable) {
				await this.sendReply(message, t('cmd.memberConfig.canNotClear', { prefix, key }));
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
		value = await this.client.cache.members.setOne(guild.id, user.id, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.memberConfig.sameValue');
			embed.fields.push({
				name: t('cmd.memberConfig.current.title'),
				value: beautify(info.type, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.memberConfig.changed.text', { prefix, key });

		// Log the settings change
		await this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null) {
			embed.fields.push({
				name: t('cmd.memberConfig.previous.title'),
				value: beautify(info.type, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.memberConfig.new.title'),
			value: value !== null ? beautify(info.type, value) : t('cmd.memberConfig.none')
		});

		// Do any post processing, such as example messages
		const cb = await this.after(message, embed, key, value, context);

		await this.sendReply(message, embed);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(key: MemberSettingsKey, value: any, { t, me }: Context): string | null {
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
