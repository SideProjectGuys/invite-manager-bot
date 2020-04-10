import { Setting, Settings } from '../../framework/decorators/Setting';
import { Guild } from '../../framework/models/Guild';
import { MusicPlatformType } from '../../types';

const BASE_GROUP = 'music';
enum Group {
	general = 'general',
	announcement = 'announcement',
	fadeMusic = 'fadeMusic',
	platform = 'platform'
}

export enum AnnouncementVoice {
	Joanna = 'Joanna',
	Salli = 'Salli',
	Kendra = 'Kendra',
	Kimberly = 'Kimberly',
	Ivy = 'Ivy',
	Matthew = 'Matthew',
	Justin = 'Justin',
	Joey = 'Joey'
}

@Settings(Guild)
export class MusicGuildSettings {
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: 100
	})
	public musicVolume: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.announcement],
		defaultValue: true
	})
	public announceNextSong: boolean;

	@Setting({
		type: 'Enum',
		grouping: [BASE_GROUP, Group.announcement],
		defaultValue: AnnouncementVoice.Joanna,
		possibleValues: Object.values(AnnouncementVoice)
	})
	public announcementVoice: AnnouncementVoice;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.fadeMusic],
		defaultValue: true
	})
	public fadeMusicOnTalk: boolean;

	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.fadeMusic],
		defaultValue: 1.0
	})
	public fadeMusicEndDelay: number;

	@Setting({
		type: 'Enum',
		enumValues: Object.values(MusicPlatformType),
		grouping: [BASE_GROUP, Group.platform],
		defaultValue: MusicPlatformType.SoundCloud
	})
	public defaultMusicPlatform: MusicPlatformType;

	@Setting({
		type: 'Enum[]',
		enumValues: Object.values(MusicPlatformType),
		grouping: [BASE_GROUP, Group.platform],
		defaultValue: []
	})
	public disabledMusicPlatforms: MusicPlatformType[];
}
