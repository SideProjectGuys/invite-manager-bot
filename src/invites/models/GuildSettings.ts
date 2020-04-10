import { TextChannel } from 'eris';

import { Setting, Settings } from '../../framework/decorators/Setting';
import { Guild } from '../../framework/models/Guild';
import { GuildPermission } from '../../types';

const BASE_GROUP = 'invites';
enum Group {
	general = 'general',
	joins = 'joins',
	leaves = 'leaves',
	leaderboard = 'leaderboard',
	fakes = 'fakes',
	ranks = 'ranks'
}

export enum LeaderboardStyle {
	normal = 'normal',
	table = 'table',
	mentions = 'mentions'
}

export enum RankAssignmentStyle {
	all = 'all',
	highest = 'highest',
	onlyAdd = 'onlyAdd'
}

@Settings(Guild)
export class InvitesGuildSettings {
	@Setting({
		type: 'Role[]',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: [],
		validate: (key, value, { t, isPremium }) => {
			if (!isPremium && value && value.length > 1) {
				return t('settings.joinRoles.multipleJoinRolesIsPremium');
			}

			return null;
		}
	})
	public joinRoles: string[];

	@Setting({
		type: 'String',
		grouping: [BASE_GROUP, Group.joins],
		defaultValue: '{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)',
		hasPremiumInfo: true
	})
	public joinMessage: string;

	@Setting({
		type: 'Channel',
		grouping: [BASE_GROUP, Group.joins],
		defaultValue: null,
		exampleValues: ['#general', '#joins'],
		validate: (_, value: TextChannel, { t, me }) => {
			const channel = value;

			if (!(channel instanceof TextChannel)) {
				return t('settings.joinMessageChannel.mustBeTextChannel');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
				return t('settings.joinMessageChannel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
				return t('settings.joinMessageChannel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
				return t('settings.joinMessageChannel.canNotSendEmbeds');
			}

			return null;
		}
	})
	public joinMessageChannel: string;

	@Setting({
		type: 'String',
		grouping: [BASE_GROUP, Group.leaves],
		defaultValue: '{memberName} **left**; Invited by **{inviterName}**',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	})
	public leaveMessage: string;

	@Setting({
		type: 'Channel',
		grouping: [BASE_GROUP, Group.leaves],
		defaultValue: null,
		exampleValues: ['#general', '#leaves'],
		validate: (_, value: TextChannel, { t, me }) => {
			const channel = value;

			if (!(channel instanceof TextChannel)) {
				return t('settings.leaveMessageChannel.mustBeTextChannel');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
				return t('settings.leaveMessageChannel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
				return t('settings.leaveMessageChannel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
				return t('settings.leaveMessageChannel.canNotSendEmbeds');
			}

			return null;
		}
	})
	public leaveMessageChannel: string;

	@Setting({
		type: 'Enum',
		enumValues: Object.values(LeaderboardStyle),
		grouping: [BASE_GROUP, Group.leaderboard],
		defaultValue: LeaderboardStyle.normal,
		possibleValues: Object.values(LeaderboardStyle)
	})
	public leaderboardStyle: LeaderboardStyle;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.leaderboard],
		defaultValue: true
	})
	public hideLeftMembersFromLeaderboard: boolean;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.fakes],
		defaultValue: true
	})
	public autoSubtractFakes: boolean;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.leaves],
		defaultValue: true
	})
	public autoSubtractLeaves: boolean;

	@Setting({
		type: 'Number' /* seconds */,
		grouping: [BASE_GROUP, Group.leaves],
		defaultValue: 600,
		exampleValues: ['60', '3600']
	})
	public autoSubtractLeaveThreshold: number;

	@Setting({
		type: 'Enum',
		enumValues: Object.values(RankAssignmentStyle),
		grouping: [BASE_GROUP, Group.ranks],
		defaultValue: RankAssignmentStyle.all,
		possibleValues: Object.values(RankAssignmentStyle)
	})
	public rankAssignmentStyle: RankAssignmentStyle;

	@Setting({
		type: 'Channel',
		grouping: [BASE_GROUP, Group.ranks],
		defaultValue: null,
		exampleValues: ['', ''],
		validate: (_, value: TextChannel, { t, me }) => {
			const channel = value;

			if (!(channel instanceof TextChannel)) {
				return t('settings.rankAnnouncementChannel.mustBeTextChannel');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
				return t('settings.rankAnnouncementChannel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
				return t('settings.rankAnnouncementChannel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
				return t('settings.rankAnnouncementChannel.canNotSendEmbeds');
			}

			return null;
		}
	})
	public rankAnnouncementChannel: string;

	@Setting({
		type: 'String',
		grouping: [BASE_GROUP, Group.ranks],
		defaultValue: 'Congratulations, **{memberMention}** has reached the **{rankName}** rank!',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	})
	public rankAnnouncementMessage: string;
}
