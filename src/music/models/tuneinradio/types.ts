export interface Follow {
	CanFollow: boolean;
	IsFollowing: boolean;
	FollowerCount: number;
	GuideId: string;
	FollowText: string;
}

export interface Play {
	CanPlay: boolean;
	IsLive: boolean;
	GuideId: string;
	SubscriptionRequired: boolean;
	CanCast: boolean;
}

export interface Echo {
	CanEcho: boolean;
	EchoCount: number;
	TargetItemId: string;
	Scope: string;
	Url: string;
}

export interface Share {
	CanShare: boolean;
	ShareUrl: string;
	ShareText: string;
	CanShareOnFacebook: boolean;
	CanShareOnTwitter: boolean;
}

export interface DestinationInfo {
	Id: string;
	SeoName: string;
	RequestType: string;
}

export interface Profile {
	CanViewProfile: boolean;
	Url: string;
	DestinationInfo: DestinationInfo;
}

export interface Embed {
	CanEmbed: boolean;
	CanEmbedTwitterAudioCard: boolean;
	CanEmbedTwitterPlayerCard: boolean;
}

export interface Actions {
	Follow: Follow;
	Play: Play;
	Echo: Echo;
	Share: Share;
	Profile: Profile;
	Embed: Embed;
}

export interface Default {
	ActionName: string;
}

export interface Behaviors {
	Default: Default;
}

export interface SEOInfo {
	Title: string;
	Path: string;
}

export interface Properties {
	SEOInfo: SEOInfo;
}

export interface Context {
	Token: string;
}

export interface TuneInRadioStation {
	GuideId: string;
	Index: number;
	Type: string;
	ContainerType: string;
	Image: string;
	Title: string;
	Subtitle: string;
	Description: string;
	Actions: Actions;
	Behaviors: Behaviors;
	Properties: Properties;
	Context: Context;
}
