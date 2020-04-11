import { Guild, Member, Message } from 'eris';

import { IMClient } from '../../client';
import { GuildPermission } from '../../types';
import { Service } from '../decorators/Service';
import { BaseGuildSettings } from '../models/GuildSettings';
import { BooleanResolver } from '../resolvers';
import { Resolver, ResolverConstructor } from '../resolvers/Resolver';
import { DatabaseService } from '../services/Database';
import {
	CreateEmbedFunc,
	MessagingService,
	SendEmbedFunc,
	SendReplyFunc,
	ShowPaginatedFunc
} from '../services/Messaging';

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
}

export interface CommandOptions {
	name: string;
	aliases: string[];
	args?: Arg[];
	flags?: Flag[];
	guildOnly: boolean;
	group: string;
	defaultAdminOnly: boolean;
	botPermissions?: GuildPermission[];
	premiumOnly?: boolean;
	extraExamples?: string[];
}

export type TranslateFunc = (key: string, replacements?: { [key: string]: any }) => string;

export type CommandContext<T = {}> = {
	guild: Guild;
	me: Member;
	t: TranslateFunc;
	settings: BaseGuildSettings & T;
	isPremium: boolean;
};

export abstract class IMCommand {
	public client: IMClient;
	public resolvers: Resolver[];

	public name: string;

	public aliases: string[];
	public args: Arg[];

	public flags: Flag[];
	public flagResolvers: Map<string, Resolver>;

	public usage: string;
	public group: string;
	public guildOnly: boolean;
	public botPermissions: GuildPermission[];
	public strict?: boolean;
	public premiumOnly?: boolean;

	public extraExamples: string[] = [];

	@Service() protected db: DatabaseService;
	@Service() protected msg: MessagingService;
	protected createEmbed: CreateEmbedFunc;
	protected sendReply: SendReplyFunc;
	protected sendEmbed: SendEmbedFunc;
	protected showPaginated: ShowPaginatedFunc;

	public constructor(client: IMClient, props: CommandOptions) {
		this.client = client;
		this.name = props.name;
		this.aliases = props.aliases.map((a) => a.toLowerCase());
		this.args = props.args ? props.args : [];
		this.flags = props.flags ? props.flags : [];
		this.group = props.group;
		this.botPermissions = props.botPermissions ? props.botPermissions : [];
		this.strict = props.defaultAdminOnly;
		this.guildOnly = props.guildOnly;
		this.premiumOnly = props.premiumOnly;
		if (props.extraExamples) {
			this.extraExamples = props.extraExamples;
		}
	}

	public async init() {
		this.createEmbed = this.msg.createEmbed.bind(this.msg);
		this.sendReply = this.msg.sendReply.bind(this.msg);
		this.sendEmbed = this.msg.sendEmbed.bind(this.msg);
		this.showPaginated = this.msg.showPaginated.bind(this.msg);

		this.usage = `{prefix}${this.name} `;

		this.flagResolvers = new Map();
		this.flags.forEach((flag) => {
			const res = flag.resolver instanceof Resolver ? flag.resolver : new flag.resolver(this.client);
			this.flagResolvers.set(flag.name, res);
			delete flag.resolver;

			const val = res instanceof BooleanResolver ? '' : '=value';
			const short = flag.short ? `-${flag.short}${val.replace('=', ' ')}|` : '';
			this.usage += `[${short}--${flag.name}${val}] `;
		});

		this.resolvers = [];
		this.args.forEach((arg) => {
			if (arg.resolver instanceof Resolver) {
				this.resolvers.push(arg.resolver);
			} else {
				this.resolvers.push(new arg.resolver(this.client));
			}
			delete arg.resolver;

			this.usage += arg.required ? `<${arg.name}> ` : `[${arg.name}] `;
		});
	}

	public getInfo(context: CommandContext) {
		let info = '';
		for (let i = 0; i < this.flags.length; i++) {
			const flag = this.flags[i];
			const help = this.flagResolvers.get(flag.name).getHelp(context);
			const descr = context.t(`cmd.${this.name}.self.flags.${flag.name}`);
			info += `**--${flag.name}**\n${descr}\n` + (help ? `${help.substr(0, 800)}\n\n` : '\n');
		}
		for (let i = 0; i < this.args.length; i++) {
			const arg = this.args[i];
			const help = this.resolvers[i].getHelp(context);
			const descr = context.t(`cmd.${this.name}.self.args.${arg.name}`);
			info += `**<${arg.name}>**\n${descr}\n` + (help ? `${help}\n\n` : '\n');
		}
		return info;
	}

	public getInfo2(context: CommandContext) {
		const ret: { args: ArgInfo[]; flags: FlagInfo[] } = { args: [], flags: [] };

		for (let i = 0; i < this.flags.length; i++) {
			const flag = this.flags[i];
			const res = this.flagResolvers.get(flag.name);
			ret.flags.push({
				name: flag.name,
				type: context.t(`resolvers.${res.getType()}.type`),
				short: flag.short,
				description: context.t(`cmd.${this.name}.self.flags.${flag.name}`),
				help: res.getHelp(context)
			});
		}

		for (let i = 0; i < this.args.length; i++) {
			const arg = this.args[i];
			const res = this.resolvers[i];
			ret.args.push({
				name: arg.name,
				type: context.t(`resolvers.${res.getType()}.type`),
				required: arg.required,
				description: context.t(`cmd.${this.name}.self.args.${arg.name}`),
				help: res.getHelp(context)
			});
		}

		return ret;
	}

	public abstract action(message: Message, args: any[], flags: { [x: string]: any }, context: CommandContext): any;
}
