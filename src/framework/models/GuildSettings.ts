import { TextChannel } from 'eris';

import { GuildPermission } from '../../types';
import { Setting, Settings } from '../decorators/Setting';

import { Guild } from './Guild';

export enum Lang {
	ar = 'ar',
	bg = 'bg',
	cs = 'cs',
	de = 'de',
	el = 'el',
	en = 'en',
	es = 'es',
	fr = 'fr',
	hu = 'hu',
	id_ID = 'id_ID',
	it = 'it',
	ja = 'ja',
	lt = 'lt',
	nl = 'nl',
	pl = 'pl',
	pt = 'pt',
	pt_BR = 'pt_BR',
	ro = 'ro',
	ru = 'ru',
	sr = 'sr',
	tr = 'tr',
	zh_CN = 'zh_CN',
	zh_TW = 'zh_TW'
}

const BASE_GROUP = 'general';

@Settings(Guild)
export class BaseGuildSettings {
	@Setting({
		type: 'String',
		grouping: [BASE_GROUP],
		defaultValue: '!',
		exampleValues: ['+', '>']
	})
	public prefix: string;
	@Setting({
		type: 'Enum',
		enumValues: Object.values(Lang),
		grouping: [BASE_GROUP],
		defaultValue: Lang.en,
		possibleValues: Object.values(Lang)
	})
	public lang: Lang;
	@Setting({
		type: 'Channel',
		grouping: [BASE_GROUP],
		defaultValue: null,
		exampleValues: ['#channel'],
		validate: (_, value: TextChannel, { t, me }) => {
			const channel = value;

			if (!(channel instanceof TextChannel)) {
				return t('settings.logChannel.mustBeTextChannel');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
				return t('settings.logChannel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
				return t('settings.logChannel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
				return t('settings.logChannel.canNotSendEmbeds');
			}

			return null;
		}
	})
	public logChannel: string;
	@Setting({
		type: 'Channel[]',
		grouping: [BASE_GROUP],
		defaultValue: []
	})
	public channels: string[];
	@Setting({
		type: 'Channel[]',
		grouping: [BASE_GROUP],
		defaultValue: []
	})
	public ignoredChannels: string[];
}
