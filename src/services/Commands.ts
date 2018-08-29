import {
	Constants,
	Guild,
	Member,
	Message,
	PrivateChannel,
	TextChannel
} from 'eris';
import fs from 'fs';
import i18n from 'i18n';
import path from 'path';

import { IMClient } from '../client';
import { Command, Context } from '../commands/Command';
import { Resolver } from '../resolvers';
import { defaultSettings } from '../sequelize';
import { Permissions, ShardCommand } from '../types';

const cmdDir = path.resolve(__dirname, '../commands/');
const idRegex: RegExp = /^(?:<@!?)?(\d+)>? ?(.*)$/;

export class Commands {
	private client: IMClient;

	public commands: Command[];
	public disabledGuilds: Set<string>;

	public constructor(client: IMClient) {
		this.client = client;

		this.commands = [];
		this.disabledGuilds = new Set();

		console.log(`Loading commands from \x1b[2m${cmdDir}\x1b[0m...`);

		// Load all commands
		const loadRecursive = (dir: string) =>
			fs.readdirSync(dir).forEach((fileName: string) => {
				const file = dir + '/' + fileName;

				if (fs.statSync(file).isDirectory()) {
					loadRecursive(file);
					return;
				}

				const clazz = require(file);
				if (clazz.default) {
					const constr = clazz.default;
					const inst = new constr(this.client);
					this.commands.push(inst);

					console.log(
						`Loaded \x1b[34m${inst.name}\x1b[0m from ` +
							`\x1b[2m${path.basename(file)}\x1b[0m`
					);
				}
			});
		loadRecursive(cmdDir);

		console.log(`Loaded \x1b[32m${this.commands.length}\x1b[0m commands!`);

		// Attach events
		this.client.on('messageCreate', this.onMessage.bind(this));
		this.client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
		this.client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
	}

	public init() {
		// Disable guilds of pro bot
		this.client.guilds.forEach(g => {
			if (g.members.has(this.client.config.proBotId)) {
				this.disabledGuilds.add(g.id);
			}
		});
	}

	public async onMessage(message: Message) {
		// Skip if this is our own message, bot message or empty messages
		if (
			message.author.id === this.client.user.id ||
			message.author.bot ||
			!message.content.length
		) {
			return;
		}

		const start = Date.now();

		const channel = message.channel;
		const guild = (channel as TextChannel).guild;

		if (guild) {
			// Check if this guild is disabled due to the pro bot
			if (
				this.disabledGuilds.has(guild.id) &&
				!message.content.startsWith(`<@${this.client.user.id}>`) &&
				!message.content.startsWith(`<@!${this.client.user.id}>`)
			) {
				return;
			}
		}

		console.log(
			`${guild ? guild.name : 'DM'} (${message.author.username}): ` +
				`${message.content}`
		);

		// Figure out which command is being run
		let content = message.content.trim();
		const sets = guild
			? await this.client.cache.get(guild.id)
			: defaultSettings;
		const lang = sets.lang;

		const t = (key: string, replacements?: { [key: string]: string }) =>
			i18n.__({ locale: lang, phrase: key }, replacements);

		if (idRegex.test(content)) {
			const matches = content.match(idRegex);

			if (matches[1] !== this.client.user.id) {
				return;
			}

			content = matches[2];
		} else {
			// Check for prefix if this is in a guild
			if (guild) {
				if (!content.startsWith(sets.prefix)) {
					return;
				}

				content = content.substring(sets.prefix.length);
			}
		}

		console.log(content);
		const splits = content.split(' ');
		const cmdStr = splits[0].toLowerCase();

		// Find the command
		let cmd: Command = this.commands.find(
			c => c.name.toLowerCase() === cmdStr || c.aliases.indexOf(cmdStr) >= 0
		);

		// Command not found
		if (!cmd) {
			// Send message to InviteManager Guild if it's a DM
			if (message.channel instanceof PrivateChannel) {
				const user = message.author;

				let oldMessages = await message.channel.getMessages(2);
				const isInitialMessage = oldMessages.length <= 1;
				if (isInitialMessage) {
					const initialMessage =
						`Hi there, thanks for writing me!\n\n` +
						`To invite me to your own server, just click here: https://invitemanager.co/add-bot?origin=initial-dm \n\n` +
						`If you need help, you can either write me here (try "help") or join our discord support server: ` +
						`https://discord.gg/Z7rtDpe.\n\nHave a good day!`;
					const embed = this.client.createEmbed({
						description: initialMessage
					});
					await this.client.sendEmbed(await user.getDMChannel(), embed);
				}

				this.client.rabbitmq.sendCommandToGuild(this.client.config.dmGuild, {
					id: message.id,
					cmd: ShardCommand.USER_DM,
					userId: user.id,
					guildId: this.client.config.dmGuild,
					channelId: this.client.config.dmChannel,
					isInitial: isInitialMessage,
					message: message.content
				});
			}
			return;
		}

		// Command not allowed in DM
		if (cmd.guildOnly && !guild) {
			return;
		}

		const isPremium = await this.client.cache.isPremium(guild.id);

		if (!isPremium && cmd.premiumOnly) {
			this.client.sendReply(message, t('permissions.premiumOnly'));
			return;
		}

		let me: Member = undefined;

		// Guild only stuff
		if (guild) {
			// Check permissions for guilds
			let member = message.member;
			if (!member) {
				member = guild.members.get(message.author.id);
			}
			if (!member) {
				member = await guild.getRESTMember(message.author.id);
			}
			if (!member) {
				console.error(
					`Could not get member ${message.author.id} for ${guild.id}`
				);
				this.client.sendReply(message, t('permissions.memberError'));
				return;
			}

			// Always allow admins
			if (
				!member.permission.has(Permissions.ADMINISTRATOR) &&
				guild.ownerID !== member.id
			) {
				const perms = (await this.client.cache.getPermissions(guild.id))[
					cmd.name
				];

				if (perms && perms.length > 0) {
					// Check that we have at least one of the required roles
					if (!perms.some(p => member.roles.indexOf(p) >= 0)) {
						this.client.sendReply(
							message,
							t('permissions.role', {
								roles: perms.map(p => `<@&${p}>`).join(', ')
							})
						);
						return;
					}
				}

				// Allow commands that require no roles, if strict is not true
				if (cmd.strict) {
					this.client.sendReply(message, t('permissions.adminOnly'));
					return;
				}
			}

			// Add self context
			me = guild.members.get(this.client.user.id);
			if (!me) {
				me = await guild.getRESTMember(this.client.user.id);
			}
		}

		const context: Context = {
			guild,
			me,
			t,
			settings: sets,
			isPremium
		};

		// Resolve arguments
		const rawArgs = splits.slice(1);
		const args: any[] = [];
		let i = 0;
		for (const arg of cmd.args) {
			const resolver = cmd.resolvers[i];

			let rawVal = rawArgs[i];
			if (arg.rest) {
				rawVal = rawArgs.slice(i).join(' ');
			}

			const val = await resolver.resolve(rawVal, context, args);
			if (typeof val === typeof undefined && arg.required) {
				this.client.sendReply(
					message,
					t('arguments.missingRequired', {
						name: arg.name,
						help: resolver.getHelp(context)
					})
				);
				return;
			}
			args.push(val);
			i++;
		}

		// Run command
		await cmd.action(message, args, context);

		const execTime: number = Date.now() - start;

		// Ignore messages that are not in guild chat or from disabled guilds
		if (guild && !this.disabledGuilds.has(guild.id)) {
			// We have to add the guild and members too, in case our DB does not have them yet
			this.client.dbQueue.addCommandUsage(
				{
					id: null,
					guildId: guild.id,
					memberId: message.author.id,
					command: cmd.name,
					args: args.join(' '),
					time: execTime,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: guild.id,
					name: guild.name,
					icon: guild.iconURL,
					memberCount: guild.memberCount
				},
				{
					id: message.author.id,
					name: message.author.username,
					discriminator: message.author.discriminator
				}
			);
		}
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		const guildId = guild.id;

		// Ignore disabled guilds
		if (this.disabledGuilds.has(guildId)) {
			return;
		}

		if (member.user.bot) {
			// Check if it's our premium bot
			if (member.user.id === this.client.config.proBotId) {
				console.log(
					`DISABLING BOT FOR ${guildId} BECAUSE PRO VERSION IS ACTIVE`
				);
				this.disabledGuilds.add(guildId);
			}
			return;
		}
	}

	private async onGuildMemberRemove(guild: Guild, member: Member) {
		// If the pro version of our bot left, re-enable this version
		if (member.user.bot && member.user.id === this.client.config.proBotId) {
			this.disabledGuilds.delete(guild.id);
			console.log(`ENABLING BOT IN ${guild.id} BECAUSE PRO VERSION LEFT`);
		}
	}
}
