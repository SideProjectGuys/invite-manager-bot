import { Guild, Member, Message } from 'eris';
import { getRepository, Repository } from 'typeorm';

import { IMClient } from '../client';
import { Channel } from '../models/Channel';
import { CommandUsage } from '../models/CommandUsage';
import { CustomInvite } from '../models/CustomInvite';
import { Guild as DBGuild } from '../models/Guild';
import { InviteCode } from '../models/InviteCode';
import { InviteCodeSetting } from '../models/InviteCodeSetting';
import { Join } from '../models/Join';
import { Member as DBMember } from '../models/Member';
import { MemberSetting } from '../models/MemberSetting';
import { PremiumSubscription } from '../models/PremiumSubscription';
import { Punishment } from '../models/Punishment';
import { PunishmentConfig } from '../models/PunishmentConfig';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import { SettingsObject } from '../models/Setting';
import { Strike } from '../models/Strike';
import { StrikeConfig } from '../models/StrikeConfig';
import { Resolver, ResolverConstructor } from '../resolvers/Resolver';
import {
	CreateEmbedFunc,
	SendEmbedFunc,
	SendReplyFunc,
	ShowPaginatedFunc
} from '../services/Messaging';
import {
	BotCommand,
	CommandGroup,
	ModerationCommand,
	OwnerCommand
} from '../types';

export interface Arg {
	name: string;
	resolver: Resolver | ResolverConstructor;
	required?: boolean;
	rest?: boolean;
}

export interface CommandOptions {
	name: BotCommand | OwnerCommand | ModerationCommand;
	aliases: string[];
	args?: Arg[];
	group?: CommandGroup;
	strict?: boolean;
	guildOnly: boolean;
	hidden?: boolean;
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

	public name: BotCommand | OwnerCommand | ModerationCommand;
	public aliases: string[];
	public args: Arg[];
	// public description: string;
	public usage: string;
	public group: CommandGroup;
	public strict?: boolean;
	public guildOnly: boolean;
	public hidden?: boolean;
	public premiumOnly?: boolean;

	protected repo: {
		cmdUsage: Repository<CommandUsage>;
		guilds: Repository<DBGuild>;
		channels: Repository<Channel>;
		members: Repository<DBMember>;
		memberSettings: Repository<MemberSetting>;
		customInvs: Repository<CustomInvite>;
		invCodes: Repository<InviteCode>;
		invCodeSettings: Repository<InviteCodeSetting>;
		joins: Repository<Join>;
		premium: Repository<PremiumSubscription>;
		punishs: Repository<Punishment>;
		punishConfigs: Repository<PunishmentConfig>;
		roles: Repository<Role>;
		rolePerms: Repository<RolePermission>;
		strikes: Repository<Strike>;
		strikeConfigs: Repository<StrikeConfig>;
	};

	protected createEmbed: CreateEmbedFunc;
	protected sendReply: SendReplyFunc;
	protected sendEmbed: SendEmbedFunc;
	protected showPaginated: ShowPaginatedFunc;

	public constructor(client: IMClient, props: CommandOptions) {
		this.client = client;
		this.name = props.name;
		this.aliases = props.aliases.map(a => a.toLowerCase());
		this.args = props.args ? props.args : [];
		this.group = props.group;
		this.strict = props.strict;
		this.guildOnly = props.guildOnly;
		this.hidden = props.hidden;
		this.premiumOnly = props.premiumOnly;

		this.usage = `{prefix}${this.name} `;

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

		this.repo = {
			channels: getRepository(Channel),
			cmdUsage: getRepository(CommandUsage),
			customInvs: getRepository(CustomInvite),
			guilds: getRepository(DBGuild),
			invCodes: getRepository(InviteCode),
			invCodeSettings: getRepository(InviteCodeSetting),
			joins: getRepository(Join),
			members: getRepository(DBMember),
			memberSettings: getRepository(MemberSetting),
			premium: getRepository(PremiumSubscription),
			punishs: getRepository(Punishment),
			punishConfigs: getRepository(PunishmentConfig),
			roles: getRepository(Role),
			rolePerms: getRepository(RolePermission),
			strikes: getRepository(Strike),
			strikeConfigs: getRepository(StrikeConfig)
		};

		this.createEmbed = client.msg.createEmbed.bind(client.msg);
		this.sendReply = client.msg.sendReply.bind(client.msg);
		this.sendEmbed = client.msg.sendEmbed.bind(client.msg);
		this.showPaginated = client.msg.showPaginated.bind(client.msg);
	}

	public getInfo(context: Context) {
		let info = '';
		for (let i = 0; i < this.args.length; i++) {
			const arg = this.args[i];
			const help = this.resolvers[i].getHelp(context);
			const descr = context.t(`cmd.${this.name}.self.args.${arg.name}`);
			info += `**<${arg.name}>**:\n${descr}\n` + (help ? `${help}\n\n` : '');
		}
		return info;
	}

	public abstract action(message: Message, args: any[], context: Context): any;
}
