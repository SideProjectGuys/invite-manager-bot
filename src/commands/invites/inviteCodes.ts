import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../../client';
import { createEmbed, sendEmbed } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	channels,
	InviteCodeAttributes,
	inviteCodes,
	members
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'invite-codes',
			aliases: [
				'invite-code',
				'get-invite-codes',
				'getInviteCode',
				'invite-codes',
				'inviteCodes',
				'InviteCode',
				'getInviteCode',
				'get-invite-code',
				'showInviteCode',
				'show-invite-code'
			],
			desc: 'Get a list of all your invite codes',
			usage: '<prefix>invite-codes',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.inviteCodes))
	@using(localize)
	public async action(message: Message, [rp]: [RP]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const lang = (await SettingsCache.get(message.guild.id)).lang;

		let codes: InviteCodeAttributes[] = await inviteCodes.findAll({
			where: {
				guildId: message.guild.id
			},
			include: [
				{
					attributes: [],
					model: members,
					as: 'inviter',
					where: {
						id: message.author.id
					},
					required: true
				}
			],
			raw: true
		});

		const activeCodes = (await message.guild.fetchInvites())
			.filter(code => code.inviter && code.inviter.id === message.author.id)
			.map(code => code);

		const newCodes = activeCodes.filter(
			code => !codes.find(c => c.code === code.code)
		);

		const newDbCodes = newCodes.map(code => ({
			code: code.code,
			channelId: code.channel ? code.channel.id : null,
			maxAge: code.maxAge,
			maxUses: code.maxUses,
			uses: code.uses,
			temporary: code.temporary,
			guildId: code.guild.id,
			inviterId: code.inviter ? code.inviter.id : null
		}));

		// Insert any new codes that haven't been used yet
		if (newCodes.length > 0) {
			await channels.bulkCreate(
				newCodes.map(c => ({
					id: c.channel.id,
					guildId: c.guild.id,
					name: c.channel.name
				})),
				{
					updateOnDuplicate: ['name']
				}
			);
			await inviteCodes.bulkCreate(newDbCodes);
		}

		codes = codes.concat(newDbCodes);

		const validCodes = codes.filter(
			c =>
				c.maxAge === 0 ||
				moment(c.createdAt)
					.add(c.maxAge, 'second')
					.isAfter(moment())
		);
		const temporaryInvites = validCodes.filter(i => i.maxAge > 0);
		const permanentInvites = validCodes.filter(i => i.maxAge === 0);
		const recommendedCode = permanentInvites.reduce(
			(max, val) => (val.uses > max.uses ? val : max),
			permanentInvites[0]
		);

		const embed = createEmbed(this.client);
		embed.setTitle(rp.CMD_INVITECODES_TITLE({ guild: message.guild.name }));

		if (permanentInvites.length === 0 && temporaryInvites.length === 0) {
			embed.setDescription(rp.CMD_INVITECODES_NO_CODES());
		} else {
			if (recommendedCode) {
				embed.addField(
					rp.CMD_INVITECODES_RECOMMENDED_CODE_TITLE(),
					`https://discord.gg/${recommendedCode.code}`
				);
			} else {
				embed.addField(
					rp.CMD_INVITECODES_RECOMMENDED_CODE_TITLE(),
					rp.CMD_INVITECODES_RECOMMENDED_CODE_NONE()
				);
			}
		}
		if (permanentInvites.length > 0) {
			embed.addBlankField();
			embed.addField(
				rp.CMD_INVITECODES_PERMANENT_TITLE(),
				rp.CMD_INVITECODES_PERMANENT_TEXT()
			);
			permanentInvites.forEach(i => {
				embed.addField(
					`${i.code}`,
					rp.CMD_INVITECODES_PERMANENT_ENTRY({
						uses: i.uses,
						maxAge: i.maxAge,
						maxUses: i.maxUses,
						channelId: i.channelId
					}),
					true
				);
			});
		}
		if (temporaryInvites.length > 0) {
			embed.addBlankField();
			embed.addField(
				rp.CMD_INVITECODES_TEMPORARY_TITLE(),
				rp.CMD_INVITECODES_TEMPORARY_TEXT()
			);
			temporaryInvites.forEach(i => {
				const maxAge = moment
					.duration(i.maxAge, 's')
					.locale(lang)
					.humanize();
				const expires = moment(i.createdAt)
					.add(i.maxAge, 's')
					.locale(lang)
					.fromNow();
				embed.addField(
					`${i.code}`,
					rp.CMD_INVITECODES_PERMANENT_ENTRY({
						uses: i.uses,
						maxAge,
						maxUses: i.maxUses,
						channelId: i.channelId,
						expires
					}),
					true
				);
			});
		}

		sendEmbed(message.author, embed);
		message.reply(rp.CMD_INVITECODES_DM_SENT());
	}
}
