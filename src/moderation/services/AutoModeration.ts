import { Guild, Member, Message, TextChannel } from 'eris';
import moment from 'moment';

import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { IMService } from '../../framework/services/Service';
import { GuildSettingsCache } from '../../settings/cache/GuildSettings';
import { StrikesCache } from '../cache/StrikesCache';
import { ModerationGuildSettings } from '../models/GuildSettings';
import { ViolationType } from '../models/StrikeConfig';

import { ModerationService } from './Moderation';

interface MiniMessage {
	id: string;
	createdAt: number;
	content: string;
	mentions: number;
	roleMentions: number;
}

type AutoModFunctions = {
	[type in ViolationType]?: (guild: Guild, message: Message, settings: ModerationGuildSettings) => Promise<boolean>;
};

export const NAME_DEHOIST_PREFIX = '▼';
export const NAME_HOIST_REGEX = /^[-.:,;|\/\\~!+*%$£€&()[\]{}°§<>?'"`^´¦@#¬]+/;

export class AutoModerationService extends IMService {
	@Service() private mod: ModerationService;
	@Cache() private guildSettingsCache: GuildSettingsCache;
	@Cache() private strikesCache: StrikesCache;

	private autoModFunctions: AutoModFunctions = {
		[ViolationType.invites]: this.invites.bind(this),
		[ViolationType.links]: this.links.bind(this),
		[ViolationType.words]: this.words.bind(this),
		[ViolationType.allCaps]: this.allCaps.bind(this),
		[ViolationType.duplicateText]: this.duplicateText.bind(this),
		[ViolationType.quickMessages]: this.quickMessages.bind(this),
		[ViolationType.mentionUsers]: this.mentionUsers.bind(this),
		[ViolationType.mentionRoles]: this.mentionRoles.bind(this),
		[ViolationType.emojis]: this.emojis.bind(this)
	};

	private messageCache: Map<string, MiniMessage[]> = new Map();
	public getMessageCacheSize() {
		return this.messageCache.size;
	}

	public async init() {
		const scanMessageCache = () => {
			const now = moment();
			this.messageCache.forEach((value, key) => {
				this.messageCache.set(
					key,
					value.filter((m) => now.diff(m.createdAt, 'second') < 60)
				);
			});
		};
		setInterval(scanMessageCache, 60 * 1000);

		this.client.on('messageCreate', this.onMessage.bind(this));
		this.client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
		this.client.on('guildMemberUpdate', this.onGuildMemberUpdate.bind(this));
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		if (!(await this.shouldProcess(guild, member))) {
			return;
		}

		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);
		const res = await this.dehoist(member, settings);

		if (res) {
			const strikesCache = await this.strikesCache.get(guild.id);
			const strike = strikesCache.find((s) => s.type === ViolationType.hoist);

			if (strike) {
				await this.mod.addStrikesAndPunish(guild, member.user, strike.type, strike.amount, null, [
					{ name: 'Previous name', value: res.name },
					{ name: 'New name', value: res.newName }
				]);
			}
		}
	}

	private async onGuildMemberUpdate(guild: Guild, member: Member) {
		if (!(await this.shouldProcess(guild, member))) {
			return;
		}

		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);
		const res = await this.dehoist(member, settings);

		if (res) {
			const strikesCache = await this.strikesCache.get(guild.id);
			const strike = strikesCache.find((s) => s.type === ViolationType.hoist);

			if (strike) {
				await this.mod.addStrikesAndPunish(guild, member.user, strike.type, strike.amount, null, [
					{ name: 'Previous name', value: res.name },
					{ name: 'New name', value: res.newName }
				]);
			}
		}
	}

	private async onMessage(message: Message) {
		const channel = message.channel as TextChannel;
		const guild = channel.guild;
		let member = guild.members.get(message.author.id);
		if (!member) {
			member = await guild.getRESTMember(message.author.id);
		}

		if (!(await this.shouldProcess(guild, member, message))) {
			return;
		}

		const cacheKey = `${guild.id}-${message.author.id}`;
		const msgs = this.messageCache.get(cacheKey);
		if (msgs) {
			msgs.push(this.getMiniMessage(message));
			this.messageCache.set(cacheKey, msgs);
		} else {
			this.messageCache.set(cacheKey, [this.getMiniMessage(message)]);
		}

		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);
		const strikesCache = await this.strikesCache.get(guild.id);
		const strikeTypes: Set<ViolationType> = new Set(Object.values(ViolationType));

		for (const strike of strikesCache) {
			strikeTypes.delete(strike.type);

			const func = this.autoModFunctions[strike.type];
			if (!func) {
				continue;
			}

			const foundViolation = await func(guild, message, settings);
			if (!foundViolation) {
				continue;
			}

			await message.delete().catch(() => undefined);

			const embed = this.mod.createBasicEmbed();
			const usr = `<@${message.author.id}>`;
			const viol = `\`${strike.type}\``;
			embed.description = `Message by ${usr} was removed because it violated the ${viol} rule.\n`;
			embed.description += `\n\nUser got ${strike.amount} strikes.`;

			await this.mod.sendReplyAndDelete(message, embed, settings);

			await this.mod.addStrikesAndPunish(guild, message.author, strike.type, strike.amount, null, [
				{ name: 'Channel', value: channel.name },
				{ name: 'Message', value: message.content }
			]);
			return;
		}

		for (const strikeType of strikeTypes) {
			const func = this.autoModFunctions[strikeType];
			if (!func) {
				continue;
			}

			const foundViolation = await func(guild, message, settings);
			if (!foundViolation) {
				continue;
			}

			message.delete().catch(() => undefined);

			const embed = this.mod.createBasicEmbed();
			const usr = `<@${message.author.id}>`;
			embed.description = `Message by ${usr} was removed because it violated the \`${strikeType}\` rule.\n`;

			await this.mod.sendReplyAndDelete(message, embed, settings);

			await this.mod.addStrikesAndPunish(guild, message.author, strikeType, 0, null, [
				{ name: 'Channel', value: channel.name },
				{ name: 'Message', value: message.content }
			]);
			return;
		}
	}

	private async shouldProcess(guild: Guild, member: Member, message?: Message) {
		// Ignore bots
		if (member.bot) {
			return false;
		}

		// Ignore DMs
		if (!guild) {
			return;
		}

		// Ignore when pro bot is active
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		const settings = await this.guildSettingsCache.get<ModerationGuildSettings>(guild.id);

		// Ignore if automod is disabled
		if (!settings.autoModEnabled) {
			return;
		}

		// If moderated roles are set then only moderate those roles
		if (settings.autoModModeratedRoles && settings.autoModModeratedRoles.length > 0) {
			if (!settings.autoModModeratedRoles.some((r) => member.roles.indexOf(r) >= 0)) {
				return;
			}
		}

		// Don't moderate ignored roles
		if (settings.autoModIgnoredRoles && settings.autoModIgnoredRoles.some((ir) => member.roles.indexOf(ir) >= 0)) {
			return;
		}

		// Check if member is "oldMember"
		if (settings.autoModDisabledForOldMembers) {
			const memberAge = moment().diff(member.joinedAt, 'second');
			if (memberAge > settings.autoModDisabledForOldMembersThreshold) {
				// This is an old member
				return;
			}
		}

		// If we have a message then check the channel
		if (message) {
			// If moderated channels are set only moderate those channels
			if (settings.autoModModeratedChannels && settings.autoModModeratedChannels.length > 0) {
				if (!(settings.autoModModeratedChannels.indexOf(message.channel.id) >= 0)) {
					return;
				}
			}

			// Don't moderate ignored channels
			if (settings.autoModIgnoredChannels && settings.autoModIgnoredChannels.indexOf(message.channel.id) >= 0) {
				return;
			}
		}
	}

	private async invites(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModInvitesEnabled) {
			return false;
		}
		const inviteLinks = ['invites.referralranks.com'];
		let hasInviteLink = inviteLinks.some((link) => {
			return message.content.indexOf(link) >= 0;
		});
		if (hasInviteLink) {
			return true;
		}

		const regex = new RegExp(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z0-9]/);
		const matches = message.content.match(regex);
		hasInviteLink = matches && matches.length > 0;
		return hasInviteLink;
	}

	private async links(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModLinksEnabled) {
			return false;
		}

		const matches = this.mod.getLinks(message);
		const hasLink = matches && matches.length > 0;
		if (!hasLink) {
			return false;
		}

		const whitelist = settings.autoModLinksWhitelist;
		const blacklist = settings.autoModLinksBlacklist;

		if (whitelist) {
			// If both are enabled, it should also be this case
			// All links will be rejected, except the ones on the whitelist
			const links = whitelist.map((link) => link.trim());
			return matches.every((match) => links.indexOf(match) > -1);
		} else if (blacklist) {
			// All links will be accepted, except the ones on the blacklist
			const links = blacklist.map((link) => link.trim());
			return matches.some((match) => links.indexOf(match) > -1);
		} else {
			// All links will be rejected
			return hasLink;
		}
	}

	private async words(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModWordsEnabled) {
			return false;
		}
		const blacklist = settings.autoModWordsBlacklist;
		if (!blacklist) {
			return false;
		}
		if (blacklist.length === 0) {
			return false;
		}

		const words = blacklist;
		const content = message.content.toLowerCase();

		const hasBlacklistedWords = words.some((word) => content.includes(word));

		return hasBlacklistedWords;
	}

	private async allCaps(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModAllCapsEnabled) {
			return false;
		}

		const minCharacters = Number(settings.autoModAllCapsMinCharacters);
		if (isNaN(minCharacters)) {
			return false;
		}

		const percentageCaps = Number(settings.autoModAllCapsPercentageCaps);
		if (isNaN(percentageCaps)) {
			return false;
		}

		if (message.content.length < minCharacters) {
			return false;
		}

		const numUppercase = message.content.length - message.content.replace(/[A-Z]/g, '').length;
		return numUppercase / message.content.length > percentageCaps / 100;
	}

	private async duplicateText(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModDuplicateTextEnabled) {
			return false;
		}

		const timeframe = settings.autoModDuplicateTextTimeframeInSeconds;

		let cachedMessages = this.messageCache.get(`${guild.id}-${message.author.id}`);
		if (cachedMessages.length === 1) {
			return false;
		} else {
			// Filter old messages
			// Filter current message
			cachedMessages = cachedMessages.filter(
				(m) => m.id !== message.id && moment().diff(m.createdAt, 'second') < timeframe
			);
			const lastMessages = cachedMessages.map((m) => m.content.toLowerCase());
			return lastMessages.indexOf(message.content.toLowerCase()) >= 0;
		}
	}

	private async quickMessages(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModQuickMessagesEnabled) {
			return false;
		}

		const numberOfMessages = settings.autoModQuickMessagesNumberOfMessages;
		const timeframe = settings.autoModQuickMessagesTimeframeInSeconds;

		let cachedMessages = this.messageCache.get(`${guild.id}-${message.author.id}`);
		if (cachedMessages.length === 1) {
			return false;
		} else {
			cachedMessages = cachedMessages.filter((m) => moment().diff(m.createdAt, 'second') < timeframe);
			return cachedMessages.length >= numberOfMessages;
		}
	}

	private async mentionUsers(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModMentionUsersEnabled) {
			return false;
		}
		const maxMentions = Number(settings.autoModMentionUsersMaxNumberOfMentions);
		if (isNaN(maxMentions)) {
			return false;
		}

		return message.mentions.length > maxMentions;
	}

	private async mentionRoles(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModMentionRolesEnabled) {
			return false;
		}
		const maxMentions = Number(settings.autoModMentionRolesMaxNumberOfMentions);
		if (isNaN(maxMentions)) {
			return false;
		}

		return message.roleMentions.length > maxMentions;
	}

	private async emojis(guild: Guild, message: Message, settings: ModerationGuildSettings): Promise<boolean> {
		if (!settings.autoModEmojisEnabled) {
			return false;
		}
		const maxEmojis = Number(settings.autoModEmojisMaxNumberOfEmojis);
		if (isNaN(maxEmojis)) {
			return;
		}

		return this.mod.countEmojis(message) > maxEmojis;
	}

	private async dehoist(
		member: Member,
		settings: ModerationGuildSettings
	): Promise<false | { name: string; newName: string }> {
		if (!settings.autoModHoistEnabled) {
			return false;
		}

		const name = member.nick ? member.nick : member.username;

		if (!NAME_HOIST_REGEX.test(name)) {
			return false;
		}

		const newName = (NAME_DEHOIST_PREFIX + ' ' + name).substr(0, 32);
		await member.edit({ nick: newName }, 'Auto dehoist').catch(() => undefined);

		return { name, newName };
	}

	private getMiniMessage(message: Message): MiniMessage {
		return {
			id: message.id,
			createdAt: message.createdAt,
			content: message.content,
			mentions: message.mentions.length,
			roleMentions: message.roleMentions.length
		};
	}
}
