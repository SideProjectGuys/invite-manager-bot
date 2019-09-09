import {
	Guild,
	Member,
	Message,
	MessageContent,
	MessageFile,
	Permission,
	Role,
	TextChannel
} from 'eris';

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1420070400000;

export class FakeChannel extends TextChannel {
	public listener: (data: any) => void;

	public createMessage(
		content: MessageContent,
		file?: MessageFile
	): Promise<Message> {
		if (this.listener) {
			this.listener(content);
		}
		return new Promise(resolve => resolve());
	}

	public permissionsOf(memberID: string): Permission {
		return new Permission(0b1111111111111111111110111111111, 0);
	}
}

export const deconstruct = (snowflake: string) => {
	const BINARY = idToBinary(snowflake).padStart(64, '0');
	return parseInt(BINARY.substring(0, 42), 2) + EPOCH;
};

export function idToBinary(num: string) {
	let bin = '';
	let high = parseInt(num.slice(0, -10), 10) || 0;
	let low = parseInt(num.slice(-10), 10);
	while (low > 0 || high > 0) {
		// tslint:disable-next-line:no-bitwise
		bin = String(low & 1) + bin;
		low = Math.floor(low / 2);
		if (high > 0) {
			low += 5000000000 * (high % 2);
			high = Math.floor(high / 2);
		}
	}
	return bin;
}

export function getShardIdForGuild(guildId: any, shardCount: number) {
	const bin = idToBinary(guildId);
	const num = parseInt(bin.substring(0, bin.length - 22), 2);
	return (num % shardCount) + 1;
}

export function to<T, U = any>(
	promise: Promise<T>,
	errorExt?: object
): Promise<[U | null, T | undefined]> {
	return promise
		.then<[null, T]>((data: T) => [null, data])
		.catch<[U, undefined]>(err => {
			if (errorExt) {
				Object.assign(err, errorExt);
			}

			return [err, undefined];
		});
}

export function getHighestRole(guild: Guild, roles: string[]): Role {
	return roles
		.map(role => guild.roles.get(role))
		.reduce((prev, role) => (role.position > prev.position ? role : prev), {
			position: -1
		} as Role);
}

export function isPunishable(
	guild: Guild,
	targetMember: Member,
	authorMember: Member,
	me: Member
) {
	const highestBotRole = getHighestRole(guild, me.roles);
	const highestMemberRole = getHighestRole(guild, targetMember.roles);
	const highestAuthorRole = getHighestRole(guild, authorMember.roles);

	return (
		targetMember.id !== guild.ownerID &&
		targetMember.id !== me.user.id &&
		highestBotRole.position > highestMemberRole.position &&
		highestAuthorRole.position > highestMemberRole.position
	);
}
