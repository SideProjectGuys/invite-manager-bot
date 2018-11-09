import crypto from 'crypto';
import { Guild, Member, Message } from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { IMClient } from '../client';

var canvasClass = require('canvas');

export enum FileMode {
	FILE = 'file',
	BUFFER = 'buffer',
	BASE64 = 'base64'
}

export interface CaptchaConfig {
	fileMode?: FileMode;
	size?: number;
	height?: number;
	width?: number;
	color?: string;
	background?: string;
	lineWidth?: number;
	saveDir?: string;
	text?: string;
	noise?: boolean;
	noiseColor?: string;
	complexity?: number;
	spacing?: number;
	nofLines?: number;
}

const captchaOptions: CaptchaConfig = {
	size: 6,
	fileMode: FileMode.BUFFER,
	height: 50,
	noiseColor: 'rgb(10,40,100)',
	color: 'rgb(50,40,50)',
	spacing: 2,
	nofLines: 4
};

export class CaptchaService {
	private client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;

		client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		const sets = await this.client.cache.settings.get(guild.id);
		if (!sets.captchaVerificationOnJoin) {
			return;
		}

		const [text, buffer] = await this.createCaptcha(captchaOptions);

		const embed = this.client.createEmbed({
			title: 'Captcha',
			description: sets.captchaVerificationWelcomeMessage.replace(
				/\{serverName\}/g,
				member.guild.name
			),
			image: {
				url: 'attachment://captcha.png'
			}
		});

		const dmChannel = await member.user.getDMChannel();
		await dmChannel.createMessage(
			{ embed },
			{
				name: 'captcha.png',
				file: buffer
			}
		);

		const endTime = moment().add(sets.captchaVerificationTimeout, 's');

		while (true) {
			const response = await this.awaitMessage(
				member,
				endTime.diff(moment(), 'ms')
			);

			if (!response) {
				await dmChannel.createMessage(
					sets.captchaVerificationFailedMessage.replace(
						/\{serverName\}/g,
						member.guild.name
					)
				);
				member.kick();
				return;
			}

			if (response === text) {
				dmChannel.createMessage(
					sets.captchaVerificationSuccessMessage.replace(
						/\{serverName\}/g,
						member.guild.name
					)
				);
				return;
			}

			dmChannel.createMessage(
				i18n.__({ locale: sets.lang, phrase: 'CAPTCHA_INVALID' })
			);
		}
	}

	public async createCaptcha(_config: CaptchaConfig) {
		const config = { ..._config };

		config.fileMode = config.fileMode || FileMode.BASE64;
		config.size = config.size || 4;
		config.height = config.height || 24;
		config.width = config.width || config.height * config.size;
		config.color = config.color || 'rgb(0,0,0)';
		config.background = config.background || 'rgb(255,255,255)';
		config.lineWidth = config.lineWidth || 2;
		config.saveDir = config.saveDir || __dirname;
		config.text =
			config.text ||
			Math.random()
				.toString()
				.substr(2, config.size);
		config.noise = config.noise !== false ? true : false;
		config.noiseColor = config.noiseColor || config.color;
		config.complexity = config.complexity || 3;
		config.complexity =
			config.complexity < 1 || config.complexity > 5 ? 3 : config.complexity;
		config.spacing = config.spacing || 2;
		config.spacing =
			config.spacing < 1 || config.spacing > 3 ? 2 : config.spacing;
		config.nofLines = config.nofLines || 2;

		const fontSize = Math.round(
			config.height * 0.5 + (15 - config.complexity * 3)
		);
		const canvas = new canvasClass(config.width, config.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = config.background;
		ctx.fillRect(0, 0, config.width, config.height);
		ctx.fillStyle = config.color;
		ctx.lineWidth = config.lineWidth;
		ctx.font = fontSize.toString() + 'px sans';

		if (config.noise) {
			ctx.strokeStyle = config.noiseColor;
			const noiseHeight = config.height;
			for (let i = 0; i < config.nofLines; i++) {
				ctx.moveTo(20, Math.random() * noiseHeight);
				ctx.bezierCurveTo(
					80,
					Math.random() * noiseHeight,
					160,
					Math.random() * noiseHeight,
					230,
					Math.random() * noiseHeight
				);
				ctx.stroke();
			}
		}

		const modifier = config.complexity / 5;
		ctx.strokeStyle = config.color;
		for (let i = 0; i < config.text.length; i++) {
			ctx.setTransform(
				Math.random() * modifier + 1 + modifier / 3,
				Math.random() * modifier + modifier / 3,
				Math.random() * modifier + modifier / 3,
				Math.random() * modifier + 1 + modifier / 3,
				(config.height * i) / (4 - config.spacing) +
					(config.height - fontSize) / 3 +
					10,
				config.height - (config.height - fontSize) / 2
			);
			ctx.fillText(config.text.charAt(i), 0, 0);
		}

		return new Promise<[string, string | Buffer]>(resolve => {
			if (config.fileMode === FileMode.FILE) {
				const fs = require('fs');

				const filename = `${new Date().getTime()}-${Math.floor(
					Math.random() * 1000
				)}.png`;
				const out = fs.createWriteStream(config.saveDir + '/' + filename);
				const stream = canvas.pngStream();

				stream.on('data', function(chunk: Buffer) {
					out.write(chunk);
				});

				stream.on('end', function() {
					resolve([config.text, filename]);
				});
			} else if (config.fileMode === FileMode.BUFFER) {
				canvas.toBuffer(function(err: Error, buf: Buffer) {
					resolve([config.text, buf]);
				});
			} else {
				canvas.toDataURL('image/png', function(err: Error, data: Buffer) {
					resolve([config.text, data]);
				});
			}
		});
	}

	private async awaitMessage(member: Member, timeLeft: number) {
		return new Promise<string>(resolve => {
			let timeOut: NodeJS.Timer;
			const func = async (resp: Message) => {
				if (member.id !== resp.author.id) {
					return;
				}

				clearTimeout(timeOut);
				this.client.removeListener('messageCreate', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

				resolve(resp.content);
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageCreate', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageCreate', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

				resolve();
			};

			timeOut = setTimeout(timeOutFunc, timeLeft);
		});
	}
}