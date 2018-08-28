import { Message, TextChannel } from 'eris';

import { strikeConfigs, ViolationType } from '../sequelize';

import { IMClient } from '../client';

export class Moderation {
	private client: IMClient;

	private strikeConfigFunctions: {
		[key in ViolationType]: (message: Message) => boolean
	};

	public constructor(client: IMClient) {
		this.client = client;

		this.strikeConfigFunctions = {
			[ViolationType.invites]: this.invites,
			[ViolationType.links]: this.links,
			[ViolationType.words]: this.words,
			[ViolationType.allCaps]: this.allCaps,
			[ViolationType.duplicateText]: this.duplicateText,
			[ViolationType.quickMessages]: this.quickMessages,
			[ViolationType.mentionUsers]: this.mentionUsers,
			[ViolationType.mentionRoles]: this.mentionRoles,
			[ViolationType.emojis]: this.emojis
		};

		client.on('messageCreate', this.onMessage.bind(this));
	}

	private async onMessage(message: Message) {
		const channel = message.channel;
		const guild = (channel as TextChannel).guild;

		if (!guild) {
			return;
		}

		console.log('SCANNING MESSAGE', message.content);

		// TODO: Add to settings cache
		let strikesList = await strikeConfigs.findAll({
			where: {
				guildId: guild.id
			},
			order: [['amount', 'DESC']]
		});

		console.log('iterating over list', strikesList);
		for (let strike of strikesList) {
			console.log('checking new strike');
			this.strikeConfigFunctions[strike.violationType](message);
		}

		if (this.scanForInviteLinks(message)) {
			console.log('FOUND LINK');
		}
	}

	private scanForLink(message: Message): boolean {
		let regex = new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
		);
		let matches = message.content.match(regex);
		let hasLink = matches && matches.length > 0;
		return true;
	}

	private scanForInviteLinks(message: Message): boolean {
		const inviteLinks = ['invites.referralranks.com'];
		let hasInviteLink = inviteLinks.some(link => {
			return message.content.indexOf(link) >= 0;
		});
		if (hasInviteLink) {
			return true;
		}

		let regex = new RegExp(
			/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/
		);
		let matches = message.content.match(regex);
		hasInviteLink = matches && matches.length > 0;
		return hasInviteLink;
	}

	private invites(message: Message): boolean {
		console.log('CHECKING invite VIOLATIONS');
		return true;
	}

	private links(message: Message): boolean {
		console.log('CHECKING links VIOLATIONS');
		return true;
	}

	private words(message: Message): boolean {
		console.log('CHECKING words VIOLATIONS');
		return true;
	}

	private allCaps(message: Message): boolean {
		console.log('CHECKING caps VIOLATIONS');
		return true;
	}

	private duplicateText(message: Message): boolean {
		console.log('CHECKING duplicateText VIOLATIONS');
		return true;
	}

	private quickMessages(message: Message): boolean {
		console.log('CHECKING quickMessage VIOLATIONS');
		return true;
	}

	private mentionUsers(message: Message): boolean {
		console.log('CHECKING mentionUser VIOLATIONS');
		return true;
	}

	private mentionRoles(message: Message): boolean {
		console.log('CHECKING mentionRole VIOLATIONS');
		return true;
	}

	private emojis(message: Message): boolean {
		console.log('CHECKING emoji VIOLATIONS');
		return true;
	}
}
