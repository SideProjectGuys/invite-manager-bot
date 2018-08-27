import { Message } from 'discord.js';

import { ViolationType } from '../sequelize';

export const strikeConfigFunctions: { [key in ViolationType]: (message: Message) => boolean } = {
	[ViolationType.invites]: invites,
	[ViolationType.links]: links,
	[ViolationType.words]: words,
	[ViolationType.allCaps]: allCaps,
	[ViolationType.duplicateText]: duplicateText,
	[ViolationType.quickMessages]: quickMessages,
	[ViolationType.mentionUsers]: mentionUsers,
	[ViolationType.mentionRoles]: mentionRoles,
	[ViolationType.emojis]: emojis
};

function invites(message: Message): boolean {
	console.log('CHECKING invite VIOLATIONS');
	return true;
}

function links(message: Message): boolean {
	console.log('CHECKING links VIOLATIONS');
	return true;
}

function words(message: Message): boolean {
	console.log('CHECKING words VIOLATIONS');
	return true;
}

function allCaps(message: Message): boolean {
	console.log('CHECKING caps VIOLATIONS');
	return true;
}

function duplicateText(message: Message): boolean {
	console.log('CHECKING duplicateText VIOLATIONS');
	return true;
}

function quickMessages(message: Message): boolean {
	console.log('CHECKING quickMessage VIOLATIONS');
	return true;
}

function mentionUsers(message: Message): boolean {
	console.log('CHECKING mentionUser VIOLATIONS');
	return true;
}

function mentionRoles(message: Message): boolean {
	console.log('CHECKING mentionRole VIOLATIONS');
	return true;
}

function emojis(message: Message): boolean {
	console.log('CHECKING emoji VIOLATIONS');
	return true;
}
