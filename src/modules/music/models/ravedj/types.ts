export interface Thumbnails {
	standard: string;
	maxres: string;
	medium: string;
	default: string;
	high: string;
}

export interface Medium {
	artist: string;
	id: string;
	provider: string;
	providerId: string;
	thumbnails: Thumbnails;
	title: string;
}

export interface Thumbnails2 {
	360: string;
	480: string;
	720: string;
	default: string;
}

export interface Urls {
	720: string;
	default: string;
	audio: string;
}

export interface Data {
	artist: string;
	createdAt: number;
	duration: number;
	id: string;
	media: Medium[];
	percentageComplete: number;
	stage: string;
	style: string;
	thumbnails: Thumbnails2;
	timeEstimate: number;
	title: string;
	updatedAt: number;
	urls: Urls;
}

export interface RaveDjResponse {
	data: Data;
}

export interface IdTokenResponse {
	kind: string;
	idToken: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
}
