import { Guild, Message, User } from 'eris';

import { IMClient } from '../../client';
import {
	BooleanResolver,
	EnumResolver,
	Resolver,
	UserResolver
} from '../../resolvers';
import {
	defaultMemberSettings,
	getMemberSettingsType,
	LogAction,
	members,
	memberSettings,
	MemberSettingsKey,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

class ValueResolver extends Resolver {
	public resolve(
		value: any,
		context: Context,
		[key]: [MemberSettingsKey]
	): Promise<any> {
		switch (getMemberSettingsType(key)) {
			case 'Boolean':
				return new BooleanResolver(this.client).resolve(value, context);

			case 'String':
				return value;

			default:
				return;
		}
	}
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.memberConfig,
			aliases: ['member-config', 'memconf', 'mc'],
			desc: 'Show and change the config of members of the server',
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(MemberSettingsKey)),
					description: 'The config setting which you want to show/change.'
				},
				{
					name: 'user',
					resolver: UserResolver,
					description: 'The member that the setting is changed for.'
				},
				{
					name: 'value',
					resolver: ValueResolver,
					description: 'The new value of the setting.'
				}
			],
			group: CommandGroup.Config,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[key, user, rawValue]: [MemberSettingsKey, User, any],
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
						value: this.fromDbValue(set.key, set.value)
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
		let oldRawVal = this.fromDbValue(key, oldVal);
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
				embed.description = t('cmd.memberConfig.notSet', {
					prefix
				});
			}
			return this.client.sendReply(message, embed);
		}

		if (rawValue === 'none' || rawValue === 'empty' || rawValue === 'null') {
			if (defaultMemberSettings[key] !== null) {
				this.client.sendReply(
					message,
					t('cmd.memberConfig.canNotClear', { prefix, key })
				);
				return;
			}
		}

		const parsedValue = this.toDbValue(guild, key, rawValue);
		if (parsedValue.error) {
			return this.client.sendReply(message, parsedValue.error);
		}

		const value = parsedValue.value;
		if (rawValue.length > 1000) {
			rawValue = rawValue.substr(0, 1000) + '...';
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

		embed.description = t('cmd.memberConfig.changed.text', { prefix });

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

	// Convert a raw value into something we can save in the database
	private toDbValue(
		guild: Guild,
		key: MemberSettingsKey,
		value: any
	): { value?: string; error?: string } {
		if (value === 'default') {
			return { value: defaultMemberSettings[key] };
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		const type = getMemberSettingsType(key);
		if (type === 'Boolean') {
			return { value: value ? 'true' : 'false' };
		}

		return { value };
	}

	// Convert a DB value into a human readable value
	private fromDbValue(key: MemberSettingsKey, value: string): string {
		if (value === undefined || value === null) {
			return value;
		}

		/*const type = getMemberSettingsType(key);
		if (type === 'Channel') {
			return `<#${value}>`;
		}*/

		return value;
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
