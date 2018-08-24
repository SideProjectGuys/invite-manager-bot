import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';
import moment from 'moment';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';
import { getInviteCounts } from '../../util';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'invite-details',
			aliases: ['inviteDetails'],
			desc: 'Shows details about where your invites are from',
			usage: '<prefix>invite-details (@user)',
			info:
				'`@user`:\n' +
				'The user for whom you want to show detailed invites.\n\n',
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.inviteDetails))
	@using(resolve('user: User'))
	@using(localize)
	public async action(message: Message, [rp, user]: [RP, User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let target = user ? user : message.author;

		const invs = await inviteCodes.findAll({
			where: {
				guildId: message.guild.id,
				inviterId: target.id
			},
			order: [['uses', 'DESC']],
			include: [
				{
					model: inviteCodeSettings,
					where: {
						guildId: message.guild.id,
						key: InviteCodeSettingsKey.name
					},
					required: false
				}
			],
			raw: true
		});

		const lang = (await SettingsCache.get(message.guild.id)).lang;

		let invText = '';
		invs.slice(0, 100).forEach(inv => {
			const name = (inv as any)['inviteCodeSettings.value'];

			invText +=
				rp.CMD_INVITEDETAILS_ENTRY({
					uses: inv.uses,
					code: name ? name : inv.code,
					name: name ? inv.code : undefined,
					createdAt: moment(inv.createdAt)
						.locale(lang)
						.fromNow()
				}) + '\n';
		});

		sendReply(message, invText);
	}
}
