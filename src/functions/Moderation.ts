import { Message } from '@yamdbf/core';

import { strikeConfigs, ViolationType } from '../sequelize';

import { strikeConfigFunctions } from './Violations';

export async function scanMessage(message: Message): Promise<void> {
	console.log('SCANNING MESSAGE', message.content);

	// TODO: Add to settings cache
	let strikesList = await strikeConfigs.findAll({
		where: {
			guildId: message.guild.id
		},
		order: [['amount', 'DESC']]
	});

	console.log('iterating over list', strikesList);
	for (let strike of strikesList) {
		console.log('checking new strike');
		strikeConfigFunctions[strike.violationType](message);
	}

	if (scanForInviteLinks(message)) {
		console.log('FOUND LINK');
	}
	// Check for links
	scanForBannedLinks(message);
	// Check for blacklisted words
	scanForBannedWords(message);
	// Check for all caps
	scanForCaps(message);
	scanForDuplicateText(message);
	scanForQuickMessageSending(message);
	// Check for mention spam
	scanForMentionUserSpam(message);
	scanForMentionRoleSpam(message);
	scanForAttachmentSpam(message);
	scanForEmojiSpam(message);
}

function scanForLink(message: Message): boolean {
	let regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
	let matches = message.content.match(regex);
	let hasLink = (matches && matches.length > 0);
	return true;
}

function scanForInviteLinks(message: Message): boolean {
	const inviteLinks = [
		'invites.referralranks.com'
	];
	let hasInviteLink = inviteLinks.some(link => {
		return message.content.indexOf(link) >= 0;
	});
	if (hasInviteLink) { return true; }

	let regex = new RegExp(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/);
	let matches = message.content.match(regex);
	hasInviteLink = (matches && matches.length > 0);
	return hasInviteLink;
}

function scanForBannedLinks(message: Message): boolean {
	// TODO: Get from DB
	const bannedLinks = [
		'google.com'
	];
	return true;
}

function scanForBannedWords(message: Message): boolean {
	return true;
}

function scanForCaps(message: Message): boolean {
	return true;
}

function scanForDuplicateText(message: Message): boolean {
	return true;
}

function scanForQuickMessageSending(message: Message): boolean {
	return true;
}

function scanForMentionUserSpam(message: Message): boolean {
	return true;
}

function scanForMentionRoleSpam(message: Message): boolean {
	return true;
}

function scanForAttachmentSpam(message: Message): boolean {
	return true;
}

function scanForEmojiSpam(message: Message): boolean {
	return true;
}
