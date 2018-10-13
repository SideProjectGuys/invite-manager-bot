import { Invite, Message } from 'eris';

import { IMClient } from '../../client';
import {
	EnumResolver,
	InviteCodeResolver,
	SettingsValueResolver
} from '../../resolvers';
import {
	channels,
	defaultInviteCodeSettings,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey,
	inviteCodeSettingsTypes,
	LogAction
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.inviteCodeConfig,
			aliases: ['invite-code-config', 'invcodeconf', 'icc'],
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(
						client,
						Object.values(InviteCodeSettingsKey)
					)
				},
				{
					name: 'code',
					resolver: InviteCodeResolver
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(
						client,
						inviteCodeSettingsTypes,
						defaultInviteCodeSettings
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

		const parsedValue = this.toDbValue(key, rawValue);
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

		const error = this.validate(value);
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

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(value: any): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		/*const type = getMemberSettingsType(key);*/

		return null;
	}
}
