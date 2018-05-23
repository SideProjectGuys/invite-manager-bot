import { Collection, User } from 'discord.js';
import {
	Client,
	Command,
	Lang,
	Message,
	Resolver,
	ResourceProxy
} from 'yamdbf';

export class BooleanResolver extends Resolver {
	private readonly truthy: Set<string>;
	private readonly falsey: Set<string>;

	public constructor(client: Client) {
		super(client, 'Boolean', 'boolean');
		this.truthy = new Set([
			'true',
			'on',
			'y',
			'yes',
			'enable',
			'positive',
			'1'
		]);
		this.falsey = new Set([
			'false',
			'off',
			'n',
			'no',
			'disable',
			'negative',
			'0'
		]);
	}

	public async validate(value: any): Promise<boolean> {
		return value === '__true__' || value === '__false__';
	}

	public resolveRaw(value: string): string | undefined {
		value = value.toLowerCase();
		if (this.truthy.has(value)) {
			return '__true__';
		}
		if (this.falsey.has(value)) {
			return '__false__';
		}
	}

	public async resolve(
		message: Message,
		command: Command,
		name: string,
		value: string
	): Promise<string> {
		const lang: string = await Lang.getLangFromMessage(message);
		const res: ResourceProxy = Lang.createResourceProxy(lang);

		const dm: boolean = message.channel.type !== 'text';
		const prefix: string = !dm
			? await message.guild.storage.settings.get('prefix')
			: '';
		const usage: string = Lang.getCommandInfo(command, lang).usage.replace(
			/<prefix>/g,
			prefix
		);

		const val = this.resolveRaw(value);
		if (typeof val === typeof undefined) {
			throw new Error(
				res.RESOLVE_ERR_RESOLVE_TYPE_TEXT({
					name,
					arg: value,
					usage,
					type: 'Boolean'
				})
			);
		}

		return val;
	}
}
