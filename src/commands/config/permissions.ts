import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import {
	rolePermissions,
	RolePermissionsInstance,
	roles,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup, OwnerCommand } from '../../types';
import { Command, Context } from '../Command';
import { RoleResolver, StringResolver, CommandResolver } from '../resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.permissions,
			aliases: ['perms', 'p'],
			desc: 'Configure permissions to use commands',
			args: [
				{
					name: 'cmd',
					resolver: CommandResolver,
					description: 'The command to configure permissions for.'
				},
				{
					name: 'role',
					resolver: RoleResolver,
					description:
						'The role which should be granted or denied access to the command.'
				}
			],
			group: CommandGroup.Config,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[cmd, role]: [Command, Role],
		{ guild, t }: Context
	): Promise<any> {
		if (!rawCmd) {
			const perms = await rolePermissions.findAll({
				attributes: ['command'],
				include: [
					{
						attributes: ['name'],
						model: roles,
						where: {
							guildId: guild.id
						}
					}
				],
				raw: true
			});

			const embed = createEmbed(this.client, {
				description: t('CMD_PERMISSIONS_ADMINS_ALL_COMMANDS')
			});

			const rs: { [x: string]: string[] } = {
				Everyone: [],
				Administrators: []
			};

			Object.values(BotCommand).forEach(command => {
				const ps = perms.filter(p => p.command === command);
				if (!ps.length) {
					if (isStrict(command as BotCommand)) {
						rs.Administrators.push(command);
					} else {
						rs.Everyone.push(command);
					}
				} else {
					ps.forEach((p: RolePermissionsInstance & { 'role.name': string }) => {
						if (!rs['@' + p['role.name']]) {
							rs['@' + p['role.name']] = [];
						}
						rs['@' + p['role.name']].push(command);
					});
				}
			});

			Object.keys(rs).forEach(r => {
				embed.fields.push({
					name: r,
					value: rs[r].map(c => `\`${c}\``).join(', ')
				});
			});

			return sendReply(this.client, message, embed);
		}

		const cmds = [];
		const cmd = rawCmd.toLowerCase();
		if (cmd === 'mod') {
			cmds.push(BotCommand.info);
			cmds.push(BotCommand.addInvites);
			cmds.push(BotCommand.clearInvites);
			cmds.push(BotCommand.restoreInvites);
			cmds.push(BotCommand.subtractFakes);
			cmds.push(BotCommand.subtractLeaves);
			cmds.push(BotCommand.export);
			cmds.push(BotCommand.makeMentionable);
			cmds.push(BotCommand.mentionRole);
		}

		const cmBot = Object.values(BotCommand).find(v => v.toLowerCase() === cmd);
		if (cmBot) {
			cmds.push(cmBot);
		}

		const cmOwner = Object.values(OwnerCommand).find(
			v => v.toLowerCase() === cmd
		) as OwnerCommand;
		if (cmOwner) {
			cmds.push(cmOwner);
		}

		if (!cmds.length) {
			return sendReply(
				this.client,
				message,
				t('CMD_PERMISSIONS_INVALID_COMMAND', {
					cmd: rawCmd,
					cmds: Object.keys(BotCommand)
						.map(k => '`' + k + '`')
						.join(', ')
				})
			);
		}

		if (!role) {
			const perms = await rolePermissions.findAll({
				attributes: [
					'command',
					[
						sequelize.fn(
							'GROUP_CONCAT',
							sequelize.literal(`roleId SEPARATOR ','`)
						),
						'roles'
					]
				],
				where: {
					command: cmds
				},
				group: ['command'],
				include: [
					{
						attributes: [],
						model: roles,
						where: {
							guildId: guild.id
						}
					}
				],
				raw: true
			});

			const embed = createEmbed(this.client, {
				description: t('CMD_PERMISSIONS_ADMINS_ALL_COMMANDS')
			});

			if (perms.length === 0) {
				cmds.forEach(c => {
					embed.fields.push({
						name: c,
						value: isStrict(c)
							? t('CMD_PERMISSIONS_ADMIN_ONLY')
							: t('CMD_PERMISSIONS_EVERYONE')
					});
				});
			} else {
				perms.forEach((p: RolePermissionsInstance & { roles: string }) => {
					embed.fields.push({
						name: p.command,
						value: p.roles
							.split(',')
							.map(r => `<@&${r}>`)
							.join(', ')
					});
				});
			}

			return sendReply(this.client, message, embed);
		}

		if (
			cmds.indexOf(BotCommand.config) >= 0 ||
			cmds.indexOf(BotCommand.inviteCodeConfig) >= 0 ||
			cmds.indexOf(BotCommand.memberConfig) >= 0 ||
			cmds.indexOf(BotCommand.permissions) >= 0 ||
			cmds.indexOf(BotCommand.addRank) >= 0
		) {
			return sendReply(
				this.client,
				message,
				t('CMD_PERMISSIONS_CANNOT_CHANGE')
			);
		}

		const oldPerms = await rolePermissions.findAll({
			where: {
				command: cmds,
				roleId: role.id
			}
		});

		if (oldPerms.length > 0) {
			oldPerms.forEach(op => op.destroy());

			sendReply(
				this.client,
				message,
				t('CMD_PERMISSIONS_REMOVED', {
					role: `<@&${role.id}>`,
					cmds: cmds.join(', ')
				})
			);
		} else {
			await roles.insertOrUpdate({
				id: role.id,
				name: role.name,
				// TODO: Set color
				color: '',
				guildId: role.guild.id
			});

			await rolePermissions.bulkCreate(
				cmds.map(c => ({
					id: null,
					command: c,
					roleId: role.id
				}))
			);

			sendReply(
				this.client,
				message,
				t('CMD_PERMISSIONS_ADDED', {
					role: `<@&${role.id}>`,
					cmds: cmds.join(', ')
				})
			);
		}

		this.client.cache.flushPermissions(guild.id);
	}
}
