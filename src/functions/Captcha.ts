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

export function createCaptcha(config: CaptchaConfig, callback: (text: string, data: string | Buffer) => void) {
	config.fileMode = config.fileMode || FileMode.BASE64;
	config.size = config.size || 4;
	config.height = config.height || 24;
	config.width = config.width || config.height * config.size / 1.5;
	config.color = config.color || 'rgb(0,0,0)';
	config.background = config.background || 'rgb(255,255,255)';
	config.lineWidth = config.lineWidth || 1;
	config.saveDir = config.saveDir || __dirname;
	config.text = config.text || Math.random().toString().substr(2, config.size);
	config.noise = (config.noise !== false) ? true : false;
	config.noiseColor = config.noiseColor || config.color;
	config.complexity = config.complexity || 3;
	config.complexity = (config.complexity < 1 || config.complexity > 5) ? 3 : config.complexity;
	config.spacing = config.spacing || 2;
	config.spacing = (config.spacing < 1 || config.spacing > 3) ? 2 : config.spacing;
	config.nofLines = config.nofLines || 2;

	const fontSize = Math.round(config.height * 0.25 + (15 - config.complexity * 3));
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
				config.width / 2,
				Math.random() * noiseHeight,
				config.width / 1.5,
				Math.random() * noiseHeight,
				config.width,
				Math.random() * noiseHeight);
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
			(config.height * i) / (4 - config.spacing) + (config.height - fontSize) / 3 + 40,
			config.height - (config.height - fontSize) / 2);
		ctx.fillText(config.text.charAt(i), 0, 0);
	}

	if (config.fileMode === FileMode.FILE) {
		const fs = require('fs');

		const filename = `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}.png`;
		const out = fs.createWriteStream(config.saveDir + '/' + filename);
		const stream = canvas.pngStream();

		stream.on('data', function (chunk: Buffer) {
			out.write(chunk);
		});

		stream.on('end', function () {
			callback(config.text, filename);
		});
	} else if (config.fileMode === FileMode.BUFFER) {
		canvas.toBuffer(function (err: Error, buf: Buffer) {
			callback(config.text, buf);
		});
	} else {
		canvas.toDataURL('image/png', function (err: Error, data: Buffer) {
			callback(config.text, data);
		});
	}
}
