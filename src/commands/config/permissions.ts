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
import { createEmbed, sendEmbed } from '../../functions/Messaging';
import { checkRoles, isStrict } from '../../middleware/CheckRoles';
import {
	rolePermissions,
	RolePermissionsInstance,
	roles,
	sequelize
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'permissions',
			aliases: ['perms', 'p'],
			desc: 'Configure permissions to use commands',
			usage: '<prefix>permissions',
			group: CommandGroup.Config
		});
	}

	@using(checkRoles(BotCommand.permissions))
	@using(resolve('cmd: string, role: Role'))
	@using(localize)
	public async action(
		message: Message,
		[rp, _cmd, role]: [RP, string, Role]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (!_cmd) {
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

			embed.setDescription(
				'Keep in mind that **Server Administrators** can **always** use **all** commands'
			);

			const rs: { [x: string]: string[] } = {
				Everyone: [],
				Administrators: []
			};

			Object.keys(BotCommand).forEach(command => {
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

			sendEmbed(message.channel, embed);
			return;
		}

		const cmd = Object.keys(BotCommand).find(
			(k: any) => BotCommand[k].toLowerCase() === _cmd.toLowerCase()
		) as BotCommand;
		if (!cmd) {
			message.channel.send(
				'Invalid command `' +
					_cmd +
					'`, use one of: ' +
					Object.keys(BotCommand)
						.map(k => '`' + k + '`')
						.join(', ')
			);
			return;
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
					command: cmd
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

			embed.setDescription(
				'Keep in mind that **Server Administrators** can **always** use **all** commands'
			);

			if (perms.length === 0) {
				embed.addField(
					cmd,
					isStrict(cmd) ? '**Administrators** only' : '**Everyone**'
				);
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

			sendEmbed(message.channel, embed);
			return;
		}

		const oldPerm = await rolePermissions.find({
			where: {
				command: cmd,
				roleId: role.id
			}
		});

		if (oldPerm) {
			oldPerm.destroy();

			message.channel.send(`Removed <@&${role.id}> from **${cmd}**`);
		} else {
			await roles.insertOrUpdate({
				id: role.id,
				name: role.name,
				color: role.hexColor,
				guildId: role.guild.id
			});

			await rolePermissions.create({
				id: null,
				command: cmd,
				roleId: role.id
			});

			message.channel.send(`Added <@&${role.id}> to **${cmd}**`);
		}

		SettingsCache.flushPermissions(message.guild.id);
	}
}
