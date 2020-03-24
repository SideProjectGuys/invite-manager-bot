import { Embed, Message, TextChannel, VoiceChannel } from 'eris';

import { IMClient } from '../../../client';
import { beautify, guildSettingsInfo } from '../../../settings';
import { BotCommand, CommandGroup, GuildPermission, InvitesCommand } from '../../../types';
import { GuildSettingsKey } from '../../models/GuildSetting';
import { JoinInvalidatedReason } from '../../models/Join';
import { LogAction } from '../../models/Log';
import { EnumResolver, SettingsValueResolver } from '../../resolvers';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.config,
			aliases: ['c'],
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(GuildSettingsKey))
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, guildSettingsInfo),
					rest: true
				}
			],
			group: CommandGroup.Config,
			// TODO: These are only needed if we propagate our call to "interactiveConfig"
			/*botPermissions: [
				GuildPermission.ADD_REACTIONS,
				GuildPermission.MANAGE_MESSAGES,
				GuildPermission.READ_MESSAGE_HISTORY
			],*/
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[key, value]: [GuildSettingsKey, any],
		flags: {},
		context: Context
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = this.createEmbed();

		if (!key) {
			const cmd = this.client.cmds.commands.find((c) => c.name === BotCommand.interactiveConfig);
			return cmd.action(message, [], {}, context);
		}

		const info = guildSettingsInfo[key];
		const oldVal = settings[key];
		embed.title = key;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal !== null) {
				embed.description = t('cmd.config.current.text', {
					prefix,
					key
				});

				if (info.clearable) {
					embed.description +=
						'\n' +
						t('cmd.config.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.config.current.title'),
					value: beautify(info.type, oldVal)
				});
			} else {
				embed.description = t('cmd.config.current.notSet', {
					prefix,
					key
				});
			}
			return this.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (!info.clearable) {
				return this.sendReply(message, t('cmd.config.canNotClear', { prefix, key }));
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
		value = await this.client.cache.guilds.setOne(guild.id, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.config.sameValue');
			embed.fields.push({
				name: t('cmd.config.current.title'),
				value: beautify(info.type, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.config.changed.text', { prefix, key });

		// Log the settings change
		await this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null && oldVal !== undefined) {
			embed.fields.push({
				name: t('cmd.config.previous.title'),
				value: beautify(info.type, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.config.new.title'),
			value: value !== null ? beautify(info.type, value) : t('cmd.config.none')
		});

		// Do any post processing, such as example messages
		const cb = await this.after(message, embed, key, value, context);

		await this.sendReply(message, embed);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(key: GuildSettingsKey, value: any, { t, isPremium, me }: Context): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		const info = guildSettingsInfo[key];

		if ((info.type === 'Channel' || info.type === 'Channel[]') && key !== GuildSettingsKey.ignoredChannels) {
			let channels = value as TextChannel[];
			if (info.type === 'Channel') {
				channels = [value as TextChannel];
			}

			for (const channel of channels) {
				if (!(channel instanceof TextChannel)) {
					return t('cmd.config.invalid.mustBeTextChannel');
				}
				if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
					return t('cmd.config.invalid.canNotReadMessages');
				}
				if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
					return t('cmd.config.invalid.canNotSendMessages');
				}
				if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
					return t('cmd.config.invalid.canNotSendEmbeds');
				}
			}
		} else if (key === GuildSettingsKey.joinRoles) {
			if (!isPremium && value && value.length > 1) {
				return t('cmd.config.invalid.multipleJoinRolesIsPremium');
			}
		}

		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		message: Message,
		embed: Embed,
		key: GuildSettingsKey,
		value: any,
		context: Context
	): Promise<Function> {
		const { guild, t, me } = context;
		const member = message.member;

		if (value && (key === GuildSettingsKey.joinMessage || key === GuildSettingsKey.leaveMessage)) {
			const preview = await this.client.invs.fillJoinLeaveTemplate(
				value,
				guild,
				member,
				{
					total: Math.round(Math.random() * 1000),
					regular: Math.round(Math.random() * 1000),
					custom: Math.round(Math.random() * 1000),
					fake: Math.round(Math.random() * 1000),
					leave: Math.round(Math.random() * 1000)
				},
				{
					invite: {
						code: 'tEsTcOdE',
						channel: message.channel as TextChannel
					},
					inviter: me
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
				return () => this.sendReply(message, preview).catch((err) => this.sendReply(message, err.message));
			}
		}

		if (value && key === GuildSettingsKey.rankAnnouncementMessage) {
			const preview = await this.client.msg.fillTemplate(guild, value, {
				memberId: member.id,
				memberName: member.user.username,
				memberFullName: member.user.username + '#' + member.user.discriminator,
				memberMention: `<@${member.id}> `,
				memberImage: member.user.avatarURL,
				rankMention: `<@& ${me.roles[0]}> `,
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
				return () => this.sendReply(message, preview).catch((err) => this.sendReply(message, err.message));
			}
		}

		if (key === GuildSettingsKey.autoSubtractFakes) {
			if (value) {
				// Subtract fake invites from all members
				const cmd = this.client.cmds.commands.find((c) => c.name === InvitesCommand.subtractFakes);
				return async () => await cmd.action(message, [], {}, context);
			} else {
				// Delete all fake invalidations
				await this.client.db.updateJoinInvalidatedReason(null, guild.id, {
					invalidatedReason: JoinInvalidatedReason.fake
				});
			}
		}

		if (key === GuildSettingsKey.autoSubtractLeaves) {
			if (value) {
				// Subtract leaves from all members
				const cmd = this.client.cmds.commands.find((c) => c.name === InvitesCommand.subtractLeaves);
				return async () => await cmd.action(message, [], {}, context);
			} else {
				// Delete all leave invalidations
				await this.client.db.updateJoinInvalidatedReason(null, guild.id, {
					invalidatedReason: JoinInvalidatedReason.leave
				});
			}
		}

		if (key === GuildSettingsKey.autoSubtractLeaveThreshold) {
			// Subtract leaves from all members to recompute threshold time
			const cmd = this.client.cmds.commands.find((c) => c.name === InvitesCommand.subtractLeaves);
			return async () => await cmd.action(message, [], {}, context);
		}

		if (key === GuildSettingsKey.announcementVoice) {
			// Play sample announcement message
			if (member.voiceState && member.voiceState.channelID) {
				const channel = guild.channels.get(member.voiceState.channelID) as VoiceChannel;
				const conn = await this.client.music.getMusicConnection(guild);
				await conn.playAnnouncement(value, `Hi, my name is ${value}`, channel);
			}
		}
	}
}
