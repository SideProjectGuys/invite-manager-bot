import { Channel, Guild, Member, Message } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	defaultSettings,
	getSettingsType,
	Lang,
	LeaderboardStyle,
	LogAction,
	RankAssignmentStyle,
	SettingsKey
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';
import { EnumResolver, StringResolver } from '../resolvers';

if (value === 'default') {
	return [
		message,
		[
			rp,
			...(await func('key: String, ...value?: String').call(
				this,
				message,
				newArgs
			))[1]
		]
	];
}

if (value === 'none' || value === 'empty' || value === 'null') {
	if (defaultSettings[dbKey] !== null) {
		const prefix = settings.prefix;
		sendReply(
			this.client,
			message,
			rp.CMD_CONFIG_KEY_CANT_CLEAR({ prefix, key: dbKey })
		);
		return; // We have to return undefined because this is a middleware
	}
	return [
		message,
		[
			rp,
			...(await func('key: String, ...value?: String').call(
				this,
				message,
				newArgs
			))[1]
		]
	];
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.config,
			aliases: ['set', 'change', 'get', 'show'],
			desc: 'Show and change the config of the server',
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(SettingsKey)),
					description: 'The config setting which you want to show/change.'
				},
				{
					name: 'value',
					resolver: StringResolver,
					description: 'The new value of the setting.'
				}
			],
			group: CommandGroup.Config,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[key, rawValue]: [SettingsKey, any],
		context: Context
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = createEmbed(this.client);

		if (!key) {
			embed.title = t('CMD_CONFIG_TITLE');
			embed.description = t('CMD_CONFIG_TEXT', { prefix });

			const notSet = [];
			const keys = Object.keys(SettingsKey);
			for (let i = 0; i < keys.length; i++) {
				const val = settings[keys[i] as SettingsKey];
				if (val) {
					embed.fields.push({
						name: keys[i],
						value: this.fromDbValue(keys[i] as SettingsKey, val).toString()
					});
				} else {
					notSet.push(keys[i]);
				}
			}

			if (notSet.length > 0) {
				embed.fields.push({
					name: `----- ${t('CMD_CONFIG_NOT_SET')} -----`,
					value: notSet.join('\n')
				});
			}

			return sendReply(this.client, message, embed);
		}

		let oldVal = settings[key];
		let oldRawVal = this.fromDbValue(key, oldVal);
		if (typeof oldRawVal === 'string' && oldRawVal.length > 1000) {
			oldRawVal = oldRawVal.substr(0, 1000) + '...';
		}

		embed.title = key;

		if (typeof rawValue === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal) {
				const clear = defaultSettings[key] === null ? 't' : undefined;
				embed.description = t('CMD_CONFIG_CURRENT_SET_TEXT', {
					prefix,
					key,
					clear
				});
				embed.fields.push({
					name: t('CMD_CONFIG_CURRENT_TITLE'),
					value: oldRawVal.toString()
				});
			} else {
				embed.description = t('CMD_CONFIG_CURRENT_NOT_SET_TEXT', {
					prefix,
					key
				});
			}
			return sendReply(this.client, message, embed);
		}

		const parsedValue = this.toDbValue(key, rawValue);
		if (parsedValue.error) {
			return sendReply(this.client, message, parsedValue.error);
		}

		const value = parsedValue.value;
		if (rawValue.length > 1000) {
			rawValue = rawValue.substr(0, 1000) + '...';
		}

		if (value === oldVal) {
			embed.description = t('CMD_CONFIG_ALREADY_SET_SAME_VALUE');
			embed.fields.push({
				name: t('CMD_CONFIG_CURRENT_TITLE'),
				value: rawValue
			});
			return sendReply(this.client, message, embed);
		}

		const error = this.validate(key, value, context);
		if (error) {
			return sendReply(this.client, message, error);
		}

		// Set new value
		this.client.cache.set(guild.id, key, value);

		embed.description = t('CMD_CONFIG_CHANGED_TEXT', { prefix, key });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.fields.push({
				name: t('CMD_CONFIG_PREVIOUS_TITLE'),
				value: oldRawVal.toString()
			});
		}

		embed.fields.push({
			name: t('CMD_CONFIG_NEW_TITLE'),
			value: value ? rawValue : t('CMD_CONFIG_NONE')
		});
		oldVal = value; // Update value for future use

		// Do any post processing, such as example messages
		// If we updated a config setting, then 'oldVal' is now the new value
		const cb = await this.after(t, message, embed, key, oldVal);

		await sendReply(this.client, message, embed);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		key: SettingsKey,
		value: any,
		{ t, me }: Context
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		const type = getSettingsType(key);

		if (type === 'Channel') {
			const channel = value as Channel;
			if (!me.permissionsIn(channel).has('VIEW_CHANNEL')) {
				return t('CMD_CONFIG_CHANNEL_CANT_VIEW');
			}
			/*if (!message.guild.me.permissionsIn(channel).has('READ_MESSAGES')) {
				return t('CMD_CONFIG_CHANNEL_CANT_READ');
			}*/
			if (!me.permissionsIn(channel).has('SEND_MESSAGES')) {
				return t('CMD_CONFIG_CHANNEL_CANT_SEND');
			}
			if (!me.permissionsIn(channel).has('EMBED_LINKS')) {
				return t('CMD_CONFIG_CHANNEL_CANT_EMBED');
			}
		}
		if (key === SettingsKey.lang) {
			if (!Lang[value]) {
				const langs = Object.keys(Lang)
					.map(k => `**${k}**`)
					.join(', ');
				return t('CMD_CONFIG_INVALID_LANG', { value, langs });
			}
		}
		if (key === SettingsKey.leaderboardStyle) {
			if (!LeaderboardStyle[value]) {
				const styles = Object.keys(LeaderboardStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return t('CMD_CONFIG_INVALID_LEADERBOARD_STYLE', { value, styles });
			}
		}
		if (key === SettingsKey.rankAssignmentStyle) {
			if (!RankAssignmentStyle[value]) {
				const styles = Object.keys(RankAssignmentStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return t('CMD_CONFIG_INVALID_RANKASSIGNMENT_STYLE', { value, styles });
			}
		}

		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		rp: RP,
		message: Message,
		embed: MessageEmbed,
		key: SettingsKey,
		value: any
	): Promise<Function> {
		const me = message.member.guild.me;
		const member = message.member;
		const user = member.user;

		if (
			value &&
			(key === SettingsKey.joinMessage || key === SettingsKey.leaveMessage)
		) {
			const preview = await this.client.fillJoinLeaveTemplate(
				value,
				message.guild,
				{
					id: member.id,
					nick: member.nickname,
					user: {
						id: user.id,
						avatarUrl: user.avatarURL(),
						createdAt: user.createdTimestamp,
						bot: user.bot,
						discriminator: user.discriminator,
						username: user.username
					}
				},
				member.joinedTimestamp,
				'tEsTcOdE',
				message.channel.id,
				(message.channel as any).name,
				me.id,
				me.nickname,
				me.user.discriminator,
				me,
				{
					total: Math.round(Math.random() * 1000),
					regular: Math.round(Math.random() * 1000),
					custom: Math.round(Math.random() * 1000),
					fake: Math.round(Math.random() * 1000),
					leave: Math.round(Math.random() * 1000)
				}
			);

			if (typeof preview === 'string') {
				embed.fields.push(t('CMD_CONFIG_PREVIEW_TITLE'), preview);
			} else {
				embed.fields.push(
					t('CMD_CONFIG_PREVIEW_TITLE'),
					t('CMD_CONFIG_PREVIEW_NEXT_MESSAGE')
				);
				return () => sendReply(message, preview);
			}
		}

		if (value && key === SettingsKey.rankAnnouncementMessage) {
			const preview = await this.client.fillTemplate(message.guild, value, {
				memberId: member.id,
				memberName: member.user.username,
				memberFullName: member.user.username + '#' + member.user.discriminator,
				memberMention: `<@${member.id}>`,
				memberImage: member.user.avatarURL(),
				rankMention: `<@&${message.guild.me.roles.highest.id}>`,
				rankName: message.guild.me.roles.highest.name
			});

			if (typeof preview === 'string') {
				embed.fields.push(t('CMD_CONFIG_PREVIEW_TITLE'), preview);
			} else {
				embed.fields.push(
					t('CMD_CONFIG_PREVIEW_TITLE'),
					t('CMD_CONFIG_PREVIEW_NEXT_MESSAGE')
				);
				return () => sendReply(message, preview);
			}
		}

		if (key === SettingsKey.autoSubtractFakes) {
			if (value === 'true') {
				// Subtract fake invites from all members
				let cmd = this.client.commands.resolve('subtract-fakes');
				return async () => await cmd.action(message, []);
			} else if (value === 'false') {
				// Delete old duplicate removals
				return async () =>
					await customInvites.destroy({
						where: {
							guildId: message.guild.id,
							generatedReason: CustomInvitesGeneratedReason.fake
						}
					});
			}
		}

		if (key === SettingsKey.autoSubtractLeaves) {
			if (value === 'true') {
				// Subtract leaves from all members
				let cmd = this.client.commands.resolve('subtract-leaves');
				return async () => await cmd.action(message, []);
			} else if (value === 'false') {
				// Delete old leave removals
				return async () =>
					await customInvites.destroy({
						where: {
							guildId: message.guild.id,
							generatedReason: CustomInvitesGeneratedReason.leave
						}
					});
			}
		}

		if (key === SettingsKey.autoSubtractLeaveThreshold) {
			// Subtract leaves from all members to recompute threshold time
			let cmd = this.client.commands.resolve('subtract-leaves');
			return async () => await cmd.action(message, []);
		}
	}

	private fromDbValue(
		key: SettingsKey,
		value: string
	): string | number | boolean {
		if (value === undefined || value === null) {
			return value;
		}

		const type = getSettingsType(key);
		if (type === 'Channel') {
			return `<#${value}>`;
		} else if (type === 'Boolean') {
			return !!value;
		} else if (type === 'Number') {
			return parseInt(value, 10);
		}

		return value;
	}

	private toDbValue(
		key: SettingsKey,
		value: any
	): { value?: string; error?: string } {
		if (value === 'default') {
			return { value: defaultSettings[key] };
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		const type = getSettingsType(key);
		if (type === 'Channel') {
			return { value: (value as any).id };
		} else if (type === 'Boolean') {
			return { value: value ? 'true' : 'false' };
		}

		return { value };
	}
}
