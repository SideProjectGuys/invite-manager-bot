import { Message, Role } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { CommandResolver, RoleResolver } from '../../../framework/resolvers';
import { BotCommand, CommandGroup, InvitesCommand } from '../../../types';

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
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, [cmd, role]: [Command, Role], flags: {}, { guild, t }: Context): Promise<any> {
		if (!cmd) {
			const perms = await this.client.db.getRolePermissionsForGuild(guild.id);

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
						if (!rs['@' + p.roleName]) {
							rs['@' + p.roleName] = [];
						}
						rs['@' + p.roleName].push(command.name);
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

		if (!role) {
			const perms = await this.client.db.getRolePermissionsForGuild(guild.id, cmd.name);

			const embed = this.createEmbed({
				description: t('cmd.permissions.adminsCanUseAll')
			});

			if (perms.length === 0) {
				embed.fields.push({
					name: cmd.name,
					value: cmd.strict ? t('cmd.permissions.adminOnly') : t('cmd.permissions.everyone')
				});
			} else {
				const grouped: Map<string, string[]> = new Map();
				perms.forEach(p => {
					let roles = grouped.get(p.command);
					if (!roles) {
						roles = [];
						grouped.set(p.command, roles);
					}
					roles.push(p.roleId);
				});

				grouped.forEach((roles, c) => {
					embed.fields.push({
						name: c,
						value: roles.map(r => `<@&${r}>`).join(', ')
					});
				});
			}

			return this.sendReply(message, embed);
		}

		if (
			cmd.name === BotCommand.config ||
			cmd.name === BotCommand.botConfig ||
			cmd.name === BotCommand.inviteCodeConfig ||
			cmd.name === BotCommand.memberConfig ||
			cmd.name === BotCommand.permissions ||
			cmd.name === InvitesCommand.addRank ||
			cmd.name === InvitesCommand.removeRank
		) {
			return this.sendReply(message, t('cmd.permissions.canNotChange'));
		}

		const oldPerms = await this.client.db.getRolePermissions(role.id, cmd.name);
		if (oldPerms) {
			await this.client.db.removeRolePermissions(oldPerms.roleId, oldPerms.command);

			await this.sendReply(
				message,
				t('cmd.permissions.removed', {
					role: `<@&${role.id}>`,
					cmds: `\`$${cmd.name}\``
				})
			);
		} else {
			await this.client.db.saveRoles([
				{
					id: role.id,
					name: role.name,
					color: role.color.toString(16),
					guildId: role.guild.id,
					createdAt: moment(role.createdAt).toDate()
				}
			]);

			await this.client.db.saveRolePermissions([
				{
					command: cmd.name,
					roleId: role.id
				}
			]);

			await this.sendReply(
				message,
				t('cmd.permissions.added', {
					role: `<@&${role.id}>`,
					cmds: `\`$${cmd.name}\``
				})
			);
		}

		this.client.cache.permissions.flush(guild.id);
	}
}
