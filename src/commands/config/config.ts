import { Embed, Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import {
	BooleanResolver,
	ChannelResolver,
	EnumResolver,
	NumberResolver,
	Resolver
} from '../../resolvers';
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
import { BotCommand, CommandGroup, Permissions } from '../../types';
import { Command, Context } from '../Command';

class ValueResolver extends Resolver {
	public resolve(
		value: any,
		context: Context,
		[key]: [SettingsKey]
	): Promise<any> {
		switch (getSettingsType(key)) {
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
			name: BotCommand.config,
			aliases: ['c'],
			desc: 'Show and change the config of the server',
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(SettingsKey)),
					description: 'The config setting which you want to show/change.'
				},
				{
					name: 'value',
					resolver: ValueResolver,
					description: 'The new value of the setting.',
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
		[key, rawValue]: [SettingsKey, any],
		context: Context
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = this.client.createEmbed();

		if (!key) {
			embed.title = t('cmd.config.title');
			embed.description = t('cmd.config.text', { prefix });

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
					name: `----- ${t('cmd.config.notSet')} -----`,
					value: notSet.join('\n')
				});
			}

			return this.client.sendReply(message, embed);
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
				embed.description =
					t('cmd.config.current.text', {
						prefix,
						key
					}) + (clear ? '\n' + t('cmd.config.current.clear') : '');
				embed.fields.push({
					name: t('cmd.config.current.title'),
					value: oldRawVal.toString()
				});
			} else {
				embed.description = t('cmd.config.current.notSet', {
					prefix,
					key
				});
			}
			return this.client.sendReply(message, embed);
		}

		if (rawValue === 'none' || rawValue === 'empty' || rawValue === 'null') {
			if (defaultSettings[key] !== null) {
				return this.client.sendReply(
					message,
					t('cmd.config.canNotClear', { prefix, key })
				);
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
			embed.description = t('cmd.config.sameValue');
			embed.fields.push({
				name: t('cmd.config.current.title'),
				value: rawValue
			});
			return this.client.sendReply(message, embed);
		}

		const error = this.validate(key, value, context);
		if (error) {
			return this.client.sendReply(message, error);
		}

		// Set new value
		this.client.cache.set(guild.id, key, value);

		embed.description = t('cmd.config.changed.text', { prefix, key });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.fields.push({
				name: t('cmd.config.previous.title'),
				value: oldRawVal.toString()
			});
		}

		embed.fields.push({
			name: t('cmd.config.new.title'),
			value: value ? rawValue : t('cmd.config.none')
		});
		oldVal = value; // Update value for future use

		// Do any post processing, such as example messages
		// If we updated a config setting, then 'oldVal' is now the new value
		const cb = await this.after(message, embed, key, oldVal, context);

		await this.client.sendReply(message, embed);

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
			const channel = value as TextChannel;
			if (!channel.permissionsOf(me.id).has(Permissions.READ_MESSAGES)) {
				return t('cmd.config.channel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(Permissions.SEND_MESSAGES)) {
				return t('cmd.config.channel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(Permissions.EMBED_LINKS)) {
				return t('cmd.config.channel.canNotSendEmbeds');
			}
		}
		if (key === SettingsKey.lang) {
			if (!Lang[value]) {
				const langs = Object.keys(Lang)
					.map(k => `**${k}**`)
					.join(', ');
				return t('cmd.config.invalid.lang', { value, langs });
			}
		}
		if (key === SettingsKey.leaderboardStyle) {
			if (!LeaderboardStyle[value]) {
				const styles = Object.keys(LeaderboardStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return t('cmd.config.invalid.leaderboardStyle', { value, styles });
			}
		}
		if (key === SettingsKey.rankAssignmentStyle) {
			if (!RankAssignmentStyle[value]) {
				const styles = Object.keys(RankAssignmentStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return t('cmd.config.invalid.rankAssignmentStyle', { value, styles });
			}
		}

		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		message: Message,
		embed: Embed,
		key: SettingsKey,
		value: any,
		context: Context
	): Promise<Function> {
		const { guild, t, me } = context;
		const member = message.member;
		const user = member.user;

		if (
			value &&
			(key === SettingsKey.joinMessage || key === SettingsKey.leaveMessage)
		) {
			const preview = await this.client.msg.fillJoinLeaveTemplate(
				value,
				guild,
				{
					id: member.id,
					nick: member.nick,
					user: {
						id: user.id,
						avatarUrl: user.avatarURL,
						createdAt: user.createdAt,
						bot: user.bot,
						discriminator: user.discriminator,
						username: user.username
					}
				},
				member.joinedAt,
				'tEsTcOdE',
				message.channel.id,
				(message.channel as any).name,
				me.id,
				me.nick,
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
				embed.fields.push({
					name: t('cmd.config.preview.title'),
					value: preview
				});
			} else {
				embed.fields.push({
					name: t('cmd.config.preview.title'),
					value: t('cmd.config.preview.nextMessage')
				});
				return () => this.client.sendReply(message, preview);
			}
		}

		if (value && key === SettingsKey.rankAnnouncementMessage) {
			const preview = await this.client.msg.fillTemplate(guild, value, {
				memberId: member.id,
				memberName: member.user.username,
				memberFullName: member.user.username + '#' + member.user.discriminator,
				memberMention: `<@${member.id}>`,
				memberImage: member.user.avatarURL,
				rankMention: `<@&${me.roles[0]}>`,
				rankName: me.roles[0]
			});

			if (typeof preview === 'string') {
				embed.fields.push({
					name: t('cmd.config.preview.title'),
					value: preview
				});
			} else {
				embed.fields.push({
					name: t('cmd.config.preview.title'),
					value: t('cmd.config.preview.nextMessage')
				});
				return () => this.client.sendReply(message, preview);
			}
		}

		if (key === SettingsKey.autoSubtractFakes) {
			if (value === 'true') {
				// Subtract fake invites from all members
				let cmd = this.client.cmds.commands.find(
					c => c.name === BotCommand.subtractFakes
				);
				return async () => await cmd.action(message, [], context);
			} else if (value === 'false') {
				// Delete old duplicate removals
				return async () =>
					await customInvites.destroy({
						where: {
							guildId: guild.id,
							generatedReason: CustomInvitesGeneratedReason.fake
						}
					});
			}
		}

		if (key === SettingsKey.autoSubtractLeaves) {
			if (value === 'true') {
				// Subtract leaves from all members
				let cmd = this.client.cmds.commands.find(
					c => c.name === BotCommand.subtractLeaves
				);
				return async () => await cmd.action(message, [], context);
			} else if (value === 'false') {
				// Delete old leave removals
				return async () =>
					await customInvites.destroy({
						where: {
							guildId: guild.id,
							generatedReason: CustomInvitesGeneratedReason.leave
						}
					});
			}
		}

		if (key === SettingsKey.autoSubtractLeaveThreshold) {
			// Subtract leaves from all members to recompute threshold time
			let cmd = this.client.cmds.commands.find(
				c => c.name === BotCommand.subtractLeaves
			);
			return async () => await cmd.action(message, [], context);
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
