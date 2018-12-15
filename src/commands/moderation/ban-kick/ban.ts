import { Message, User } from 'eris';

import { IMClient } from '../../../client';
import {
	NumberResolver,
	StringResolver,
	UserResolver
} from '../../../resolvers';
import { punishments, PunishmentType } from '../../../sequelize';
import { CommandGroup, ModerationCommand, Permissions } from '../../../types';
import { isPunishable, to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.ban,
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			flags: [
				{
					name: 'deleteMessageDays',
					resolver: NumberResolver,
					short: 'd',
					valueRequired: true
				}
			],
			group: CommandGroup.Moderation,
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetUser, reason]: [User, string],
		{ deleteMessageDays }: { deleteMessageDays: number },
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.mod.createPunishmentEmbed(
			targetUser.username,
			targetUser.avatarURL
		);

		const targetMember = guild.members.get(targetUser.id);

		if (!me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description = t('cmd.ban.missingPermissions');
		} else if (
			!targetMember ||
			isPunishable(guild, targetMember, message.member, me)
		) {
			const days = deleteMessageDays ? deleteMessageDays : 0;
			let [error] = await to(
				this.client.banGuildMember(guild.id, targetUser.id, days, reason)
			);
			if (error) {
				embed.description = t('cmd.ban.error');
			} else {
				embed.description = t('cmd.ban.done');
				let punishment = await punishments.create({
					id: null,
					guildId: guild.id,
					memberId: targetUser.id,
					punishmentType: PunishmentType.ban,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});
				const logEmbed = this.client.mod.createPunishmentEmbed(
					targetUser.username,
					targetUser.avatarURL
				);
				logEmbed.description = `**Punishment ID**: ${punishment.id}\n`;
				logEmbed.description += `**Target**: ${targetUser}\n`;
				logEmbed.description += `**Target**: ${targetUser.username}#${
					targetUser.discriminator
				} (ID: ${targetUser.id})\n`;
				logEmbed.description += `**Action**: ${punishment.punishmentType}\n`;
				logEmbed.description += `**Mod**: ${message.author.username}\n`;
				logEmbed.description += `**Reason**: ${reason}\n`;
				this.client.logModAction(guild, logEmbed);
			}
		} else {
			embed.description = t('cmd.ban.canNotBan');
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
