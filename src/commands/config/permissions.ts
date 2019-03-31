import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { CommandResolver, RoleResolver } from '../../resolvers';
import {
	rolePermissions,
	RolePermissionsInstance,
	roles,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.permissions,
			aliases: ['perms'],
			args: [
				{
					name: 'cmd',
					resolver: CommandResolver
				},
				{
					name: 'role',
					resolver: RoleResolver
				}
			],
			group: CommandGroup.Config,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[rawCmd, role]: [Command, Role],
		flags: {},
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

			const embed = this.createEmbed({
				description: t('cmd.permissions.adminsCanUseAll')
			});

			const rs: { [x: string]: string[] } = {
				Everyone: [],
				Administrators: []
			};

			this.client.cmds.commands.forEach(command => {
				const ps = perms.filter(p => p.command === command.name);
				if (!ps.length) {
					if (command.strict) {
						rs.Administrators.push(command.name);
					} else {
						rs.Everyone.push(command.name);
					}
				} else {
					ps.forEach((p: RolePermissionsInstance & { 'role.name': string }) => {
						if (!rs['@' + p['role.name']]) {
							rs['@' + p['role.name']] = [];
						}
						rs['@' + p['role.name']].push(command.name);
					});
				}
			});

			Object.keys(rs).forEach(r => {
				if (rs[r].length <= 0) {
					return;
				}

				embed.fields.push({
					name: r,
					value: rs[r].map(c => `\`${c}\``).join(', ')
				});
			});

			return this.sendReply(message, embed);
		}

		const cmds = [rawCmd];

		/*
		TODO: This should be moved to the setup command

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
		*/

		if (!cmds.length) {
			return this.sendReply(
				message,
				t('cmd.permissions.invalidCommand', {
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
					command: cmds.map(c => c.name)
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

			const embed = this.createEmbed({
				description: t('cmd.permissions.adminsCanUseAll')
			});

			if (perms.length === 0) {
				cmds.forEach(c => {
					embed.fields.push({
						name: c.name,
						value: c.strict
							? t('cmd.permissions.adminOnly')
							: t('cmd.permissions.everyone')
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

			return this.sendReply(message, embed);
		}

		if (
			cmds.find(c => c.name === BotCommand.config) ||
			cmds.find(c => c.name === BotCommand.botConfig) ||
			cmds.find(c => c.name === BotCommand.inviteCodeConfig) ||
			cmds.find(c => c.name === BotCommand.memberConfig) ||
			cmds.find(c => c.name === BotCommand.permissions) ||
			cmds.find(c => c.name === BotCommand.addRank)
		) {
			return this.sendReply(message, t('cmd.permissions.canNotChange'));
		}

		const oldPerms = await rolePermissions.findAll({
			where: {
				command: cmds.map(c => c.name),
				roleId: role.id
			}
		});

		if (oldPerms.length > 0) {
			oldPerms.forEach(op => op.destroy());

			this.sendReply(
				message,
				t('cmd.permissions.removed', {
					role: `<@&${role.id}>`,
					cmds: cmds.map(c => '`' + c.name + '`').join(', ')
				})
			);
		} else {
			await roles.insertOrUpdate({
				id: role.id,
				name: role.name,
				color: role.color.toString(16),
				guildId: role.guild.id
			});

			await rolePermissions.bulkCreate(
				cmds.map(c => ({
					id: null,
					command: c.name,
					roleId: role.id
				}))
			);

			this.sendReply(
				message,
				t('cmd.permissions.added', {
					role: `<@&${role.id}>`,
					cmds: cmds.map(c => '`' + c.name + '`').join(', ')
				})
			);
		}

		this.client.cache.permissions.flush(guild.id);
	}
}
