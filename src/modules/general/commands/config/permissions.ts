import { Message, Role } from 'eris';
import { In } from 'typeorm';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { CommandResolver, RoleResolver } from '../../../../framework/resolvers';
import { BotCommand, CommandGroup, InvitesCommand } from '../../../../types';

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

	public async action(
		message: Message,
		[rawCmd, role]: [Command, Role],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		if (!rawCmd) {
			const perms = await this.client.repo.rolePermission.find({
				where: { role: { guildId: guild.id } },
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
			const perms = await this.client.repo.rolePermission.find({
				where: {
					command: In(cmds.map(c => c.name)),
					role: { guildId: guild.id }
				},
				relations: ['role']
			});

			const embed = this.createEmbed({
				description: t('cmd.permissions.adminsCanUseAll')
			});

			if (perms.length === 0) {
				cmds.forEach(c => {
					embed.fields.push({
						name: c.name,
						value: c.strict ? t('cmd.permissions.adminOnly') : t('cmd.permissions.everyone')
					});
				});
			} else {
				const grouped: Map<string, string[]> = new Map();
				perms.forEach(p => {
					let roles = grouped.get(p.command);
					if (!roles) {
						roles = [];
						grouped.set(p.command, roles);
					}
					roles.push(p.role.id);
				});

				grouped.forEach((roles, cmd) => {
					embed.fields.push({
						name: cmd,
						value: roles.map(r => `<@&${r}>`).join(', ')
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
			cmds.find(c => c.name === InvitesCommand.addRank) ||
			cmds.find(c => c.name === InvitesCommand.removeRank)
		) {
			return this.sendReply(message, t('cmd.permissions.canNotChange'));
		}

		const oldPerms = await this.client.repo.rolePermission.find({
			where: {
				command: cmds.map(c => c.name),
				roleId: role.id
			}
		});

		if (oldPerms.length > 0) {
			await this.client.repo.rolePermission.delete({ roleId: In(oldPerms.map(p => p.roleId)) });

			await this.sendReply(
				message,
				t('cmd.permissions.removed', {
					role: `<@&${role.id}>`,
					cmds: cmds.map(c => '`' + c.name + '`').join(', ')
				})
			);
		} else {
			await this.client.repo.role.save({
				id: role.id,
				name: role.name,
				color: role.color.toString(16),
				guildId: role.guild.id
			});

			await this.client.repo.rolePermission.save(
				cmds.map(c => ({
					command: c.name,
					roleId: role.id
				}))
			);

			await this.sendReply(
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
