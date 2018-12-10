import { Embed, Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import { settingsDescription } from '../../descriptions/settings';
import { EnumResolver, SettingsValueResolver } from '../../resolvers';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	defaultSettings,
	LogAction,
	SettingsKey,
	settingsTypes
} from '../../sequelize';
import { BotCommand, CommandGroup, Permissions } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.config,
			aliases: ['c'],
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(client, Object.values(SettingsKey))
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(
						client,
						settingsTypes,
						defaultSettings
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
		[key, value]: [SettingsKey, any],
		flags: {},
		context: Context
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = this.client.createEmbed();

		if (!key) {
			embed.title = t('cmd.config.title');
			embed.description = t('cmd.config.text', { prefix }) + '\n\n';

			const configs: { [x: string]: string[] } = {};
			Object.keys(settingsDescription).forEach((k: SettingsKey) => {
				const descr = settingsDescription[k];
				if (!configs[descr.group]) {
					configs[descr.group] = [];
				}
				configs[descr.group].push('`' + k + '`');
			});

			Object.keys(configs).forEach(group => {
				embed.description +=
					`**${group}**\n` + configs[group].join(', ') + '\n\n';
			});

			return this.client.sendReply(message, embed);
		}

		let oldVal = settings[key];
		embed.title = key;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal !== null) {
				embed.description = t('cmd.config.current.text', {
					prefix,
					key
				});

				if (defaultSettings[key] === null ? 't' : undefined) {
					embed.description +=
						'\n' +
						t('cmd.config.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.config.current.title'),
					value: this.beautify(key, oldVal)
				});
			} else {
				embed.description = t('cmd.config.current.notSet', {
					prefix,
					key
				});
			}
			return this.client.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (defaultSettings[key] !== null) {
				return this.client.sendReply(
					message,
					t('cmd.config.canNotClear', { prefix, key })
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
		value = await this.client.cache.settings.setOne(guild.id, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.config.sameValue');
			embed.fields.push({
				name: t('cmd.config.current.title'),
				value: this.beautify(key, oldVal)
			});
			return this.client.sendReply(message, embed);
		}

		embed.description = t('cmd.config.changed.text', { prefix, key });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null) {
			embed.fields.push({
				name: t('cmd.config.previous.title'),
				value: this.beautify(key, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.config.new.title'),
			value: value !== null ? this.beautify(key, value) : t('cmd.config.none')
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
		key: SettingsKey,
		value: any,
		{ t, me }: Context
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		const type = settingsTypes[key];

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
				return () => this.client.sendReply(message, preview);
			}
		}

		if (key === SettingsKey.autoSubtractFakes) {
			if (value) {
				// Subtract fake invites from all members
				let cmd = this.client.cmds.commands.find(
					c => c.name === BotCommand.subtractFakes
				);
				return async () => await cmd.action(message, [], {}, context);
			} else {
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
			if (value) {
				// Subtract leaves from all members
				let cmd = this.client.cmds.commands.find(
					c => c.name === BotCommand.subtractLeaves
				);
				return async () => await cmd.action(message, [], {}, context);
			} else {
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
			return async () => await cmd.action(message, [], {}, context);
		}
	}

	private beautify(key: SettingsKey, value: any) {
		const type = settingsTypes[key];
		if (type === 'Channel') {
			return `<#${value}>`;
		} else if (type === 'Boolean') {
			return value ? 'True' : 'False';
		} else if (type === 'Role') {
			return `<@&${value}>`;
		} else if (type === 'Role[]') {
			return value.map((v: any) => `<@&${v}>`).join(' ');
		} else if (type === 'Channel[]') {
			return value.map((v: any) => `<#${v}>`).join(' ');
		} else if (type === 'String[]') {
			return value.map((v: any) => '`' + v + '`').join(', ');
		}
		if (typeof value === 'string' && value.length > 1000) {
			return value.substr(0, 1000) + '...';
		}
		return value;
	}
}
