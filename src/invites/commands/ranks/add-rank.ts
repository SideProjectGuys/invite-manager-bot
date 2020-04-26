import { Message, Role } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { LogAction } from '../../../framework/models/Log';
import { IMModule } from '../../../framework/Module';
import { NumberResolver, RoleResolver, StringResolver } from '../../../framework/resolvers';
import { RanksCache } from '../../cache/RanksCache';
import { RanksService } from '../../services/Ranks';

const MIN = -2147483648;
const MAX = 2147483647;

export default class extends IMCommand {
	@Service() private ranks: RanksService;
	@Cache() private ranksCache: RanksCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'addRank',
			aliases: ['add-rank', 'set-rank', 'setRank'],
			args: [
				{
					name: 'role',
					resolver: RoleResolver,
					required: true
				},
				{
					name: 'invites',
					resolver: new NumberResolver(module.client, MIN, MAX),
					required: true
				},
				{
					name: 'info',
					resolver: StringResolver,
					rest: true
				}
			],
			group: 'Ranks',
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!addRank @Role 5', '!addRank "Role with space" 10 Wow, already 10 people!']
		});
	}

	public async action(
		message: Message,
		[role, invites, description]: [Role, number, string],
		flags: {},
		{ guild, t, me }: CommandContext
	): Promise<any> {
		await this.db.saveRoles([
			{
				id: role.id,
				name: role.name,
				guildId: role.guild.id,
				color: role.color.toString(16),
				createdAt: new Date(role.createdAt)
			}
		]);

		let myRole: Role;
		me.roles.forEach((r) => {
			const gRole = guild.roles.get(r);
			if (!myRole || gRole.position > myRole.position) {
				myRole = gRole;
			}
		});

		// Check if we are higher then the role we want to assign
		if (!myRole || myRole.position < role.position) {
			return this.sendReply(
				message,
				t('cmd.addRank.roleTooHigh', {
					role: role.name,
					myRole: myRole ? myRole.name : '<None>'
				})
			);
		}

		const ranks = await this.ranksCache.get(guild.id);
		const rank = ranks.find((r) => r.roleId === role.id);
		const descr = description ? description : '';

		let isNew = false;
		if (rank) {
			rank.numInvites = invites;
			rank.description = descr;
			await this.ranks.saveRank(rank);
		} else {
			await this.ranks.saveRank({
				guildId: role.guild.id,
				roleId: role.id,
				numInvites: invites,
				description: descr
			});
			isNew = true;
		}

		await this.client.logAction(guild, message, isNew ? LogAction.addRank : LogAction.updateRank, {
			roleId: role.id,
			numInvites: invites,
			description
		});

		this.ranksCache.flush(guild.id);

		if (!isNew) {
			return this.sendReply(
				message,
				t('cmd.addRank.updated', {
					role: `<@&${role.id}>`,
					invites,
					description
				})
			);
		} else {
			return this.sendReply(
				message,
				t('cmd.addRank.created', {
					role: `<@&${role.id}>`,
					invites,
					description
				})
			);
		}
	}
}
