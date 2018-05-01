import { Collection, User } from 'discord.js';
import { Client, Command, Lang, Message, Resolver, ResourceProxy } from 'yamdbf';

export class BooleanResolver extends Resolver {
	public constructor(client: Client) {
		super(client, 'Boolean');
	}

	public async validate(value: any): Promise<boolean> {
		// 'typeof true' is another way of checking === 'boolean', but more robust
		return typeof value === typeof true;
	}

	public async resolve(message: Message, command: Command, name: string, value: string): Promise<boolean> {
		const lang: string = await Lang.getLangFromMessage(message);
		const res: ResourceProxy = Lang.createResourceProxy(lang);

		const dm: boolean = message.channel.type !== 'text';
		const prefix: string = !dm ? await message.guild.storage.settings.get('prefix') : '';
		const usage: string = Lang.getCommandInfo(command, lang).usage.replace(/<prefix>/g, prefix);

		const val = value.toLowerCase();

		if (val === 'true' || val === 'yes' || val === 'on' || val === 'positive') {
			return true;
		}
		if (val === 'false' || val === 'no' || val === 'off' || val === 'negative') {
			return false;
		}

		throw new Error(res.RESOLVE_ERR_RESOLVE_TYPE_TEXT({ name, arg: value, usage, type: 'Boolean' }));
	}
}
