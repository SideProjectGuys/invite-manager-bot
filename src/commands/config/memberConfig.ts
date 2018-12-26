import { Message, User } from 'eris';

import { IMClient } from '../../client';
import {
	EnumResolver,
	SettingsValueResolver,
	UserResolver
} from '../../resolvers';
import {
	LogAction,
	members,
	memberSettings,
	MemberSettingsKey,
	sequelize
} from '../../sequelize';
import {
	beautify,
	canClear,
	fromDbValue,
	memberSettingsInfo,
	toDbValue
} from '../../settings';
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
					resolver: new SettingsValueResolver(client, memberSettingsInfo),
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
		flags: {},
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
			const allSets = await memberSettings.findAll({
				attributes: [
					'id',
					'key',
					'value',
					[sequelize.literal('`member`.`name`'), 'memberName']
				],
				where: {
					guildId: guild.id,
					key
				},
				include: [
					{
						attributes: [],
						model: members
					}
				],
				raw: true
			});
			if (allSets.length > 0) {
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

		const username = user.username;
		const oldSet = await memberSettings.find({
			where: {
				guildId: guild.id,
				memberId: user.id,
				key
			},
			raw: true
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
				embed.description = t('cmd.inviteCodeConfig.current.text', {
					prefix,
					key
				});

				if (canClear(key)) {
					embed.description +=
						'\n' +
						t('cmd.inviteCodeConfig.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.inviteCodeConfig.current.title'),
					value: beautify(key, oldVal)
				});
			} else {
				embed.description = t('cmd.memberConfig.current.notSet', {
					prefix
				});
			}
			return this.client.sendReply(message, embed);
		}

		if (rawValue === 'none' || rawValue === 'empty' || rawValue === 'null') {
			if (!canClear(key)) {
				this.client.sendReply(
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
			return this.client.sendReply(message, embed);
		}

		const error = this.validate(message, key, value);
		if (error) {
			return this.client.sendReply(message, error);
		}

		await memberSettings.insertOrUpdate({
			id: null,
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

		return this.client.sendReply(message, embed);
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
