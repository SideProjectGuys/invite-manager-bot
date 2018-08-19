import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Role } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles, isStrict } from '../../middleware';
import {
	rolePermissions,
	RolePermissionsInstance,
	roles,
	sequelize
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, OwnerCommand, RP } from '../../types';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'permissions',
			aliases: ['perms', 'p'],
			desc: 'Configure permissions to use commands',
			usage: '<prefix>permissions cmd (@role)',
			group: CommandGroup.Config
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.permissions))
	@using(resolve('cmd: string, role: Role'))
	@using(localize)
	public async action(
		message: Message,
		[rp, rawCmd, role]: [RP, string, Role]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (!rawCmd) {
			const perms = await rolePermissions.findAll({
				attributes: ['command'],
				include: [
					{
						attributes: ['name'],
						model: roles,
						where: {
							guildId: message.guild.id
						}
					}
				],
				raw: true
			});

			const embed = createEmbed(this.client);

			embed.setDescription(rp.CMD_PERMISSIONS_ADMINS_ALL_COMMANDS());

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
				embed.addField(r, rs[r].map(c => `\`${c}\``).join(', '));
			});

			return sendReply(message, embed);
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
				message,
				rp.CMD_PERMISSIONS_INVALID_COMMAND({
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
							guildId: message.guild.id
						}
					}
				],
				raw: true
			});

			const embed = createEmbed(this.client);

			embed.setDescription(rp.CMD_PERMISSIONS_ADMINS_ALL_COMMANDS());

			if (perms.length === 0) {
				cmds.forEach(c => {
					embed.addField(
						c,
						isStrict(c)
							? rp.CMD_PERMISSIONS_ADMIN_ONLY()
							: rp.CMD_PERMISSIONS_EVERYONE()
					);
				});
			} else {
				perms.forEach((p: RolePermissionsInstance & { roles: string }) => {
					embed.addField(
						p.command,
						p.roles
							.split(',')
							.map(r => `<@&${r}>`)
							.join(', ')
					);
				});
			}

			return sendReply(message, embed);
		}

		if (
			cmds.indexOf(BotCommand.config) >= 0 ||
			cmds.indexOf(BotCommand.inviteCodeConfig) >= 0 ||
			cmds.indexOf(BotCommand.memberConfig) >= 0 ||
			cmds.indexOf(BotCommand.permissions) >= 0 ||
			cmds.indexOf(BotCommand.addRank) >= 0
		) {
			return sendReply(message, rp.CMD_PERMISSIONS_CANNOT_CHANGE());
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
				message,
				rp.CMD_PERMISSIONS_REMOVED({
					role: `<@&${role.id}>`,
					cmds: cmds.join(', ')
				})
			);
		} else {
			await roles.insertOrUpdate({
				id: role.id,
				name: role.name,
				color: role.hexColor,
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
				message,
				rp.CMD_PERMISSIONS_ADDED({
					role: `<@&${role.id}>`,
					cmds: cmds.join(', ')
				})
			);
		}

		SettingsCache.flushPermissions(message.guild.id);
	}
}
