import { Message, Role } from 'eris';

import { PermissionsCache } from '../../cache/Permissions';
import { Cache } from '../../decorators/Cache';
import { IMModule } from '../../Module';
import { CommandResolver, RoleResolver } from '../../resolvers';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	@Cache() private premissionsCache: PermissionsCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'permissions',
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
			group: 'Config',
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[cmd, role]: [IMCommand, Role],
		flags: {},
		{ guild, t }: CommandContext
	): Promise<any> {
		if (!cmd) {
			const perms = await this.db.getRolePermissionsForGuild(guild.id);

			const embed = this.createEmbed({
				description: t('cmd.permissions.adminsCanUseAll')
			});

			const rs: { [x: string]: string[] } = {
				Everyone: [],
				Administrators: []
			};

			this.client.commands.forEach((command) => {
				const ps = perms.filter((p) => p.command === command.name);
				if (!ps.length) {
					if (command.strict) {
						rs.Administrators.push(command.name);
					} else {
						rs.Everyone.push(command.name);
					}
				} else {
					// Check if the everyone role is allowed to use it
					if (ps.some((p) => p.roleId === guild.id)) {
						rs.Everyone.push(command.name);
					} else {
						ps.forEach((p) => {
							const roleName = '@' + p.roleName;
							if (!rs[roleName]) {
								rs[roleName] = [];
							}
							rs[roleName].push(command.name);
						});
					}
				}
			});

			Object.keys(rs).forEach((r) => {
				if (rs[r].length <= 0) {
					return;
				}

				embed.fields.push({
					name: r,
					value: rs[r].map((c) => `\`${c}\``).join(', ')
				});
			});

			return this.sendReply(message, embed);
		}

		/*
		TODO: This should be moved to the setup command

		const cmds = [];
		const cmd = rawCmd.toLowerCase();
		if (cmd === 'mod') {
			cmds.push('info');
			cmds.push('addInvites');
			cmds.push('clearInvites');
			cmds.push('restoreInvites');
			cmds.push('subtractFakes');
			cmds.push('subtractLeaves');
			cmds.push('export');
			cmds.push('makeMentionable');
			cmds.push('mentionRole');
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
			const perms = await this.db.getRolePermissionsForGuild(guild.id, cmd.name);

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
				perms.forEach((p) => {
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
						value: roles.map((r) => `<@&${r}>`).join(', ')
					});
				});
			}

			return this.sendReply(message, embed);
		}

		if (
			cmd.name === 'config' ||
			cmd.name === 'botConfig' ||
			cmd.name === 'inviteCodeConfig' ||
			cmd.name === 'memberConfig' ||
			cmd.name === 'permissions' ||
			cmd.name === 'interactiveConfig' ||
			cmd.name === 'addRank' ||
			cmd.name === 'removeRank'
		) {
			return this.sendReply(message, t('cmd.permissions.canNotChange', { cmd: cmd.name }));
		}

		const oldPerms = await this.db.getRolePermissions(guild.id, role.id, cmd.name);
		if (oldPerms) {
			await this.db.removeRolePermissions(guild.id, oldPerms.roleId, oldPerms.command);

			await this.sendReply(
				message,
				t('cmd.permissions.removed', {
					role: role.id === guild.id ? '@everyone' : `<@&${role.id}>`,
					cmds: `\`${cmd.name}\``
				})
			);
		} else {
			await this.db.saveRoles([
				{
					id: role.id,
					name: role.name,
					color: role.color.toString(16),
					guildId: role.guild.id,
					createdAt: new Date(role.createdAt)
				}
			]);

			await this.db.saveRolePermissions(guild.id, [
				{
					command: cmd.name,
					roleId: role.id
				}
			]);

			await this.sendReply(
				message,
				t('cmd.permissions.added', {
					role: role.id === guild.id ? '@everyone' : `<@&${role.id}>`,
					cmds: `\`${cmd.name}\``
				})
			);
		}

		this.premissionsCache.flush(guild.id);
	}
}
