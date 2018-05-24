import { RichEmbed } from 'discord.js';
import * as moment from 'moment';
import { Command, Logger, logger, Message } from 'yamdbf';

import { IMClient } from '../client';
import { InviteCodeAttributes, inviteCodes, members } from '../sequelize';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

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

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

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

		const newCodes: InviteCodeAttributes[] = activeCodes
			.filter(code => !codes.find(c => c.code === code.code))
			.map(code => ({
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
			await inviteCodes.bulkCreate(newCodes);
		}

		codes = codes.concat(newCodes);

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
		embed.setTitle(
			`You have the following codes on the server ${message.guild.name}`
		);

		if (permanentInvites.length === 0 && temporaryInvites.length === 0) {
			embed.setDescription(
				`You don't have any active invite codes. ` +
					`Please ask the moderators of the server how to create one.`
			);
		} else {
			if (recommendedCode) {
				embed.addField(
					`Recommended invite code`,
					`https://discord.gg/${recommendedCode.code}`
				);
			} else {
				embed.addField(
					`Recommended invite code`,
					`Please create a permanent invite code.`
				);
			}
		}
		if (permanentInvites.length > 0) {
			embed.addBlankField();
			embed.addField('Permanent', `These invites don't expire.`);
			permanentInvites.forEach(i => {
				embed.addField(
					`${i.code}`,
					`**Uses**: ${i.uses}\n` +
						`**Max Age**:${i.maxAge}\n` +
						`**Max Uses**: ${i.maxUses}\n` +
						`**Channel**: <#${i.channelId}>\n`,
					true
				);
			});
		}
		if (temporaryInvites.length > 0) {
			embed.addBlankField();
			embed.addField('Temporary', 'These invites expire after a certain time.');
			temporaryInvites.forEach(i => {
				const maxAge = moment.duration(i.maxAge, 's').humanize();
				const expires = moment(i.createdAt)
					.add(i.maxAge, 's')
					.fromNow();
				embed.addField(
					`${i.code}`,
					`**Uses**: ${i.uses}\n` +
						`**Max Age**: ${maxAge}\n` +
						`**Max Uses**: ${i.maxUses}\n` +
						`**Channel**: <#${i.channelId}>\n` +
						`**Expires**: ${expires}`,
					true
				);
			});
		}

		sendEmbed(message.author, embed);
		message.reply('I sent you a DM with all your invite codes.');
	}
}
