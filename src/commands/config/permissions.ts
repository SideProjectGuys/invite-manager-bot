import { Message, Role } from 'eris';
import { In } from 'typeorm';

import { IMClient } from '../../client';
import { RolePermission } from '../../models/RolePermission';
import { CommandResolver, RoleResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.permissions,
			aliases: ['perms', 'p'],
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
		{ guild, t }: Context
	): Promise<any> {
		if (!rawCmd) {
			const perms = await this.repo.rolePerms.find({
				where: {
					role: {
						guildId: guild.id
					}
				},
				relations: ['role']
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
					ps.forEach(p => {
						if (!rs['@' + p.role.name]) {
							rs['@' + p.role.name] = [];
						}
						rs['@' + p.role.name].push(command.name);
					});
				}
			});

			Object.keys(rs).forEach(r => {
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
			const rawPerms = await this.repo.rolePerms.find({
				where: {
					command: In(cmds.map(c => c.name)),
					role: {
						guildId: guild.id
					}
				},
				relations: ['role']
			});
			const perms = new Map<string, RolePermission[]>();
			rawPerms.forEach(p => {
				let ps = perms.get(p.command);
				if (!ps) {
					ps = [];
					perms.set(p.command, ps);
				}
				ps.push(p);
			});

			const embed = this.createEmbed({
				description: t('cmd.permissions.adminsCanUseAll')
			});

			if (perms.size === 0) {
				cmds.forEach(c => {
					embed.fields.push({
						name: c.name,
						value: c.strict
							? t('cmd.permissions.adminOnly')
							: t('cmd.permissions.everyone')
					});
				});
			} else {
				perms.forEach((ps, cmd) => {
					embed.fields.push({
						name: cmd,
						value: ps.map(p => `<@&${p}>`).join(', ')
					});
				});
			}

			return this.sendReply(message, embed);
		}

		if (
			cmds.find(c => c.name === BotCommand.config) ||
			cmds.find(c => c.name === BotCommand.inviteCodeConfig) ||
			cmds.find(c => c.name === BotCommand.memberConfig) ||
			cmds.find(c => c.name === BotCommand.permissions) ||
			cmds.find(c => c.name === BotCommand.addRank)
		) {
			return this.sendReply(message, t('cmd.permissions.canNotChange'));
		}

		const oldPerms = await this.repo.rolePerms.find({
			where: {
				command: cmds.map(c => c.name),
				roleId: role.id
			}
		});

		if (oldPerms.length > 0) {
			await this.repo.rolePerms.update(
				{
					id: In(oldPerms.map(p => p.id))
				},
				{
					deletedAt: new Date()
				}
			);

			this.sendReply(
				message,
				t('cmd.permissions.removed', {
					role: `<@&${role.id}>`,
					cmds: cmds.map(c => '`' + c.name + '`').join(', ')
				})
			);
		} else {
			await this.repo.roles.save({
				id: role.id,
				name: role.name,
				color: role.color.toString(16),
				guildId: role.guild.id
			});

			await this.repo.rolePerms.save(
				cmds.map(c => ({
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
