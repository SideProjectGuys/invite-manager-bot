import { Guild, Member, Message, TextChannel } from 'eris';

import { IMClient } from '../client';
import { Command } from '../commands/Command';
import { defaultSettings } from '../sequelize';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>? ?(.*)$/;

export class Commands {
	private client: IMClient;

	public commands: Command[];
	public disabledGuilds: Set<string>;

	public constructor(client: IMClient) {
		this.client = client;

		this.commands = [];
		this.disabledGuilds = new Set();

		let clazz = require('../commands/info/botInfo').default;
		this.commands.push(new clazz(this));

		clazz = require('../commands/info/getBot').default;
		this.commands.push(new clazz(this));

		clazz = require('../commands/info/members').default;
		this.commands.push(new clazz(this));

		clazz = require('../commands/invites/invites').default;
		this.commands.push(new clazz(this));

		clazz = require('../commands/info/help').default;
		this.commands.push(new clazz(this));

		clazz = require('../commands/config/config').default;
		this.commands.push(new clazz(this));

		clazz = require('../commands/ranks/addRank').default;
		this.commands.push(new clazz(this));

		// Attach events
		this.client.on('messageCreate', this.onMessage);
		this.client.on('guildMemberAdd', this.onGuildMemberAdd);
		this.client.on('guildMemberRemove', this.onGuildMemberRemove);
	}

	public init() {
		// Disable guilds of pro bot
		this.client.guilds.forEach(g => {
			if (g.members.has(this.client.config.proBotId)) {
				this.disabledGuilds.add(g.id);
			}
		});
	}

	private async onMessage(message: Message) {
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

		console.log(cmd ? cmd.name : 'INVALID COMMAND: ' + cmdStr);

		// Command not found, or not allowed in DM
		if (!cmd || (cmd.guildOnly && !guild)) {
			return;
		}

		let me: Member = undefined;
		const lang = sets.lang;

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
			if (!message.member.permission.has('ADMINISTRATOR')) {
				const perms = (await this.client.cache.getPermissions(guild.id))[
					cmd.name
				];

				if (perms && perms.length > 0) {
					// Check that we have at least one of the required roles
					if (!perms.some(p => message.member.roles.indexOf(p) >= 0)) {
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

		const context = {
			guild,
			me,
			t,
			settings: sets
		};

		// Resolve arguments
		const rawArgs = splits.slice(1);
		const args: any[] = [];
		let i = 0;
		for (const arg of cmd.args) {
			const resolver = cmd.resolvers[i];
			const val = await resolver.resolve(rawArgs[i], context, args);
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

		console.log(args);

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

		// TODO: Reimplement sending bot DMs
		// Skip if this is a valid bot command
		// (technically we ignore all prefixes, but bot only responds to default one)
		/*const cmd = message.content.split(' ')[0].toLowerCase();
		if (this.commands.get(cmd) || this.commands.get(cmd.substring(1))) {
			return;
		}

		if (message.channel instanceof DMChannel) {
			const user = message.author;
			const dmChannel = this.channels.get(config.dmChannel) as TextChannel;

			let oldMessages = await message.channel.messages.fetch({ limit: 2 });
			const isInitialMessage = oldMessages.size <= 1;
			if (isInitialMessage) {
				const initialMessage =
					`Hi there, thanks for writing me!\n\n` +
					`To invite me to your own server, just click here: https://invitemanager.co/add-bot?origin=initial-dm \n\n` +
					`If you need help, you can either write me here (try "help") or join our discord support server: ` +
					`https://discord.gg/Z7rtDpe.\n\nHave a good day!`;
				const embed = createEmbed(this);
				embed.setDescription(initialMessage);
				await sendEmbed(user, embed);
			}

			if (dmChannel) {
				const embed = createEmbed(this);
				embed.setAuthor(
					`${user.username}-${user.discriminator}`,
					user.avatarURL()
				);
				embed.fields.push('User ID', user.id, true);
				embed.fields.push('Initial message', isInitialMessage, true);
				embed.setDescription(message.content);
				await sendEmbed(dmChannel, embed);
			}
		}*/
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

	private async onGuildMemberRemove(member: Member) {
		const guildId = member.guild.id;

		// If the pro version of our bot left, re-enable this version
		if (member.user.bot && member.user.id === this.client.config.proBotId) {
			this.disabledGuilds.delete(guildId);
			console.log(`ENABLING BOT IN ${guildId} BECAUSE PRO VERSION LEFT`);
		}
	}
}
