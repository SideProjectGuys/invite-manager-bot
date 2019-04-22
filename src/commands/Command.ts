import { Guild, Member, Message } from 'eris';

import { IMClient } from '../client';
import { BooleanResolver } from '../resolvers';
import { Resolver, ResolverConstructor } from '../resolvers/Resolver';
import {
	CreateEmbedFunc,
	SendEmbedFunc,
	SendReplyFunc,
	ShowPaginatedFunc
} from '../services/Messaging';
import { SettingsObject } from '../settings';
import { BotCommand, CommandGroup, ModerationCommand } from '../types';

export interface Arg {
	name: string;
	resolver: Resolver | ResolverConstructor;
	required?: boolean;
	rest?: boolean;
}

interface ArgInfo {
	name: string;
	type: string;
	required: boolean;
	description: string;
	help?: string;
	examples: string[];
}

export interface Flag {
	name: string;
	resolver: Resolver | ResolverConstructor;
	short?: string;
}

interface FlagInfo {
	name: string;
	type: string;
	short?: string;
	description: string;
	help?: string;
	examples: string[];
}

export interface CommandOptions {
	name: BotCommand | ModerationCommand;
	aliases: string[];
	args?: Arg[];
	flags?: Flag[];
	group?: CommandGroup;
	strict?: boolean;
	guildOnly: boolean;
	premiumOnly?: boolean;
}

export type TranslateFunc = (
	key: string,
	replacements?: { [key: string]: any }
) => string;

export type Context = {
	guild: Guild;
	me: Member;
	t: TranslateFunc;
	settings: SettingsObject;
	isPremium: boolean;
};

export abstract class Command {
	public client: IMClient;
	public resolvers: Resolver[];

	public name: BotCommand | ModerationCommand;

	public aliases: string[];
	public args: Arg[];

	public flags: Flag[];
	public flagResolvers: Map<string, Resolver>;

	public usage: string;
	public group: CommandGroup;
	public strict?: boolean;
	public guildOnly: boolean;
	public premiumOnly?: boolean;

	protected createEmbed: CreateEmbedFunc;
	protected sendReply: SendReplyFunc;
	protected sendEmbed: SendEmbedFunc;
	protected showPaginated: ShowPaginatedFunc;

	public constructor(client: IMClient, props: CommandOptions) {
		this.client = client;
		this.name = props.name;
		this.aliases = props.aliases.map(a => a.toLowerCase());
		this.args = props.args ? props.args : [];
		this.flags = props.flags ? props.flags : [];
		this.group = props.group;
		this.strict = props.strict;
		this.guildOnly = props.guildOnly;
		this.premiumOnly = props.premiumOnly;

		this.usage = `{prefix}${this.name} `;

		this.flagResolvers = new Map();
		this.flags.forEach(flag => {
			const res =
				flag.resolver instanceof Resolver
					? flag.resolver
					: new flag.resolver(this.client);
			this.flagResolvers.set(flag.name, res);
			delete flag.resolver;

			const val = res instanceof BooleanResolver ? '' : '=value';
			const short = flag.short ? `-${flag.short}${val.replace('=', ' ')}|` : '';
			this.usage += `[${short}--${flag.name}${val}] `;
		});

		this.resolvers = [];
		this.args.forEach(arg => {
			if (arg.resolver instanceof Resolver) {
				this.resolvers.push(arg.resolver);
			} else {
				this.resolvers.push(new arg.resolver(this.client));
			}
			delete arg.resolver;

			this.usage += arg.required ? `<${arg.name}> ` : `[${arg.name}] `;
		});

		this.createEmbed = client.msg.createEmbed.bind(client.msg);
		this.sendReply = client.msg.sendReply.bind(client.msg);
		this.sendEmbed = client.msg.sendEmbed.bind(client.msg);
		this.showPaginated = client.msg.showPaginated.bind(client.msg);
	}

	public getInfo(context: Context) {
		let info = '';
		for (let i = 0; i < this.flags.length; i++) {
			const flag = this.flags[i];
			const help = this.flagResolvers.get(flag.name).getHelp(context);
			const descr = context.t(`cmd.${this.name}.self.flags.${flag.name}`);
			info +=
				`**--${flag.name}**\n${descr}\n` +
				(help ? `${help.substr(0, 800)}\n\n` : '\n');
		}
		for (let i = 0; i < this.args.length; i++) {
			const arg = this.args[i];
			const help = this.resolvers[i].getHelp(context);
			const descr = context.t(`cmd.${this.name}.self.args.${arg.name}`);
			info += `**<${arg.name}>**\n${descr}\n` + (help ? `${help}\n\n` : '\n');
		}
		return info;
	}

	public getInfo2(context: Context) {
		const ret: { args: ArgInfo[]; flags: FlagInfo[] } = { args: [], flags: [] };

		for (let i = 0; i < this.flags.length; i++) {
			const flag = this.flags[i];
			const res = this.flagResolvers.get(flag.name);
			ret.flags.push({
				name: flag.name,
				type: res.getType(),
				short: flag.short,
				description: context.t(`cmd.${this.name}.self.flags.${flag.name}`),
				help: res.getHelp(context),
				examples: res.getExamples(false)
			});
		}

		for (let i = 0; i < this.args.length; i++) {
			const arg = this.args[i];
			const res = this.resolvers[i];
			ret.args.push({
				name: arg.name,
				type: res.getType(),
				required: arg.required,
				description: context.t(`cmd.${this.name}.self.args.${arg.name}`),
				examples: res.getExamples(arg.rest),
				help: res.getHelp(context)
			});
		}

		return ret;
	}

	public abstract action(
		message: Message,
		args: any[],
		flags: { [x: string]: any },
		context: Context
	): any;
}
