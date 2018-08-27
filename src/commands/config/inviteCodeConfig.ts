import { Guild, Invite, Message } from 'eris';

import { IMClient } from '../../client';
import {
	BooleanResolver,
	ChannelResolver,
	EnumResolver,
	InviteCodeResolver,
	NumberResolver,
	Resolver
} from '../../resolvers';
import {
	channels,
	defaultInviteCodeSettings,
	getInviteCodeSettingsType,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey,
	LogAction
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

class ValueResolver extends Resolver {
	public resolve(
		value: any,
		context: Context,
		[key]: [InviteCodeSettingsKey]
	): Promise<any> {
		switch (getInviteCodeSettingsType(key)) {
			case 'Channel':
				return new ChannelResolver(this.client).resolve(value, context);

			case 'Boolean':
				return new BooleanResolver(this.client).resolve(value, context);

			case 'Number':
				return new NumberResolver(this.client).resolve(value, context);

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
			name: BotCommand.inviteCodeConfig,
			aliases: ['invite-code-config', 'invcodeconf', 'icc'],
			desc: 'Show and change the config of invite codes of the server',
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(
						client,
						Object.values(InviteCodeSettingsKey)
					),
					description: 'The config setting which you want to show/change.'
				},
				{
					name: 'code',
					resolver: InviteCodeResolver,
					description: 'The invite code that the setting is changed for.'
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
		[key, inv, rawValue]: [InviteCodeSettingsKey, Invite, any],
		context: Context
	): Promise<any> {
		const { guild, t, settings } = context;
		const prefix = settings.prefix;
		const embed = this.client.createEmbed();

		if (!key) {
			embed.title = t('cmd.inviteCodeConfig.title');
			embed.description = t('cmd.inviteCodeConfig.text', { prefix });

			const keys = Object.keys(InviteCodeSettingsKey);
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.keys.title'),
				value: keys.join('\n')
			});

			return this.client.sendReply(message, embed);
		}

		if (!inv) {
			const allSets = await inviteCodeSettings.findAll({
				attributes: ['id', 'key', 'value', 'inviteCode'],
				where: {
					guildId: guild.id,
					key
				},
				raw: true
			});
			if (allSets.length > 0) {
				allSets.forEach((set: any) =>
					embed.fields.push({
						name: set.inviteCode,
						value: this.fromDbValue(set.key, set.value)
					})
				);
			} else {
				embed.description = t('cmd.inviteCodeConfig.noneSet');
			}
			return this.client.sendReply(message, embed);
		}

		// Check if this is actually a real invite code
		if (inv.guild.id !== guild.id) {
			return this.client.sendReply(
				message,
				t('cmd.inviteCodeConfig.codeForOtherGuild')
			);
		}

		const oldSet = await inviteCodeSettings.find({
			where: {
				guildId: guild.id,
				inviteCode: inv.code,
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
				const clear = defaultInviteCodeSettings[key] === null ? 't' : undefined;
				embed.description = t('cmd.inviteCodeConfig.current.text', {
					prefix,
					key,
					code: inv.code,
					clear
				});
				embed.fields.push({
					name: t('cmd.inviteCodeConfig.current.title'),
					value: oldRawVal
				});
			} else {
				embed.description = t('cmd.inviteCodeConfig.current.notSet', {
					prefix
				});
			}
			return this.client.sendReply(message, embed);
		}

		if (rawValue === 'none' || rawValue === 'empty' || rawValue === 'null') {
			if (defaultInviteCodeSettings[key] !== null) {
				this.client.sendReply(
					message,
					t('cmd.inviteCodeConfig.canNotClear', { prefix, key })
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
			embed.description = t('cmd.inviteCodeConfig.sameValue');
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.current.title'),
				value: rawValue
			});
			return this.client.sendReply(message, embed);
		}

		const error = this.validate(message, key, value, context);
		if (error) {
			return this.client.sendReply(message, error);
		}

		await channels.insertOrUpdate({
			id: inv.channel.id,
			guildId: inv.guild.id,
			name: inv.channel.name
		});

		await inviteCodes.insertOrUpdate({
			code: inv.code,
			guildId: inv.guild.id,
			inviterId: inv.inviter.id,
			channelId: inv.channel.id,
			uses: inv.uses,
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			temporary: inv.temporary,
			createdAt: inv.createdAt
		});

		await inviteCodeSettings.insertOrUpdate({
			id: null,
			guildId: guild.id,
			inviteCode: inv.code,
			key,
			value
		});

		embed.description = t('cmd.inviteCodeConfig.changed.text', { prefix });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.memberConfig, {
			key,
			inviteCode: inv.code,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.previous.text'),
				value: oldRawVal
			});
		}

		embed.fields.push({
			name: t('cmd.inviteCodeConfig.new.title'),
			value: value ? rawValue : t('cmd.inviteCodeConfig.none')
		});
		oldVal = value; // Update value for future use

		return this.client.sendReply(message, embed);
	}

	// Convert a raw value into something we can save in the database
	private toDbValue(
		guild: Guild,
		key: InviteCodeSettingsKey,
		value: any
	): { value?: string; error?: string } {
		if (value === 'default') {
			return { value: defaultInviteCodeSettings[key] };
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		if (key === InviteCodeSettingsKey.roles) {
			const roles: string[] = value
				.split(' ')
				.map((r: string) => r.substring(3, r.length - 1));
			return { value: roles.join(',') };
		}

		const type = getInviteCodeSettingsType(key);
		if (type === 'Boolean') {
			return { value: value ? 'true' : 'false' };
		}

		return { value };
	}

	// Convert a DB value into a human readable value
	private fromDbValue(key: InviteCodeSettingsKey, value: string): string {
		if (value === undefined || value === null) {
			return value;
		}

		if (key === InviteCodeSettingsKey.roles) {
			return value
				.split(',')
				.map(r => `<@&${r}>`)
				.join(' ');
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
		key: InviteCodeSettingsKey,
		value: any,
		{ guild, t }: Context
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		if (key === InviteCodeSettingsKey.roles) {
			const roles: string[] = value.split(/[ ,]/g);
			if (!roles.every(r => !!guild.roles.get(r))) {
				return t('cmd.inviteCodeConfig.invalidRole');
			}
		}

		/*const type = getMemberSettingsType(key);*/

		return null;
	}
}
