import { Message, User } from 'eris';

import { IMClient } from '../../client';
import { LogAction } from '../../models/Log';
import {
	defaultMemberSettings,
	MemberSettingsKey,
	memberSettingsTypes
} from '../../models/MemberSetting';
import {
	EnumResolver,
	SettingsValueResolver,
	UserResolver
} from '../../resolvers';
import { fromDbValue, toDbValue } from '../../settings';
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
		[key, user, rawValue]: [MemberSettingsKey, User, any],
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

		if (!user) {
			const allSets = await this.repo.memberSettings.find({
				where: {
					guildId: guild.id,
					key
				},
				relations: ['member']
			});
			if (allSets.length > 0) {
				allSets.forEach(set =>
					embed.fields.push({
						name: set.member.name,
						value: fromDbValue(set.key, set.value)
					})
				);
			} else {
				embed.description = t('cmd.memberConfig.notSet');
			}
			return this.sendReply(message, embed);
		}

		const username = user.username;
		const oldSet = await this.repo.memberSettings.findOne({
			where: {
				guildId: guild.id,
				memberId: user.id,
				key
			}
		});

		let oldVal = oldSet ? oldSet.value : undefined;
		let oldRawVal = fromDbValue(key, oldVal);
		if (oldRawVal && oldRawVal.length > 1000) {
			oldRawVal = oldRawVal.substr(0, 1000) + '...';
		}

		embed.title = key;

		if (typeof rawValue === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal) {
				const clear = defaultMemberSettings[key] === null ? 't' : undefined;
				embed.description = t('cmd.memberConfig.current.text', {
					prefix,
					key,
					username,
					clear
				});
				embed.fields.push({
					name: t('cmd.memberConfig.current.title'),
					value: oldRawVal
				});
			} else {
				embed.description = t('cmd.memberConfig.current.notSet', {
					prefix
				});
			}
			return this.sendReply(message, embed);
		}

		if (rawValue === 'none' || rawValue === 'empty' || rawValue === 'null') {
			if (defaultMemberSettings[key] !== null) {
				this.sendReply(
					message,
					t('cmd.memberConfig.canNotClear', { prefix, key })
				);
				return;
			}
		}

		const value = toDbValue(key, rawValue);
		if (rawValue.length > 1000) {
			rawValue = `${rawValue.substr(0, 1000)}...`;
		}

		if (value === oldVal) {
			embed.description = t('cmd.memberConfig.sameValue');
			embed.fields.push({
				name: t('cmd.memberConfig.current.title'),
				value: rawValue
			});
			return this.sendReply(message, embed);
		}

		const error = this.validate(message, key, value);
		if (error) {
			return this.sendReply(message, error);
		}

		// TODO: Use insert or update
		await this.repo.memberSettings.save({
			guildId: guild.id,
			memberId: user.id,
			key,
			value
		});

		embed.description = t('cmd.memberConfig.changed.text', {
			prefix,
			key,
			username
		});

		// Log the settings change
		this.client.logAction(guild, message, LogAction.memberConfig, {
			key,
			userId: user.id,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.fields.push({
				name: t('cmd.memberConfig.previous.title'),
				value: oldRawVal
			});
		}

		embed.fields.push({
			name: t('cmd.memberConfig.new.title'),
			value: value ? rawValue : t('cmd.memberConfig.none')
		});
		oldVal = value; // Update value for future use

		return this.sendReply(message, embed);
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		message: Message,
		key: MemberSettingsKey,
		value: any
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		/*const type = getMemberSettingsType(key);*/

		return null;
	}
}
