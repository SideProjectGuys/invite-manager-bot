import { Guild, Message } from 'eris';

import { IMClient } from '../client';
import { BotCommand, CommandGroup, OwnerCommand } from '../types';

export interface CommandOptions {
	name: BotCommand | OwnerCommand;
	desc: string;
	aliases: string[];
	usage: string;
	group: CommandGroup;
	strict: boolean;
}

export type TranslateFunc = (
	key: string,
	replacements?: { [key: string]: string }
) => string;

export abstract class Command {
	public name: BotCommand | OwnerCommand;
	public aliases: string[];
	public description: string;
	public usage: string;
	public group: CommandGroup;
	public strict: boolean;

	public client: IMClient;

	public constructor(props: CommandOptions) {
		this.name = props.name;
		this.aliases = props.aliases.map(a => a.toLowerCase());
		this.description = props.desc;
		this.usage = props.usage;
		this.group = props.group;
		this.strict = props.strict;
	}

	public abstract action(
		guild: Guild,
		message: Message,
		args: any[],
		t: TranslateFunc
	): any;
}
