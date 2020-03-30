import { Emoji, GuildChannel, Message, TextChannel } from 'eris';

import { IMClient } from '../../../client';
import { beautify, guildSettingsInfo, SettingsGroup, SettingsInfo, toDbValue } from '../../../settings';
import { BotCommand, BotType, CommandGroup, GuildPermission } from '../../../types';
import { GuildSettingsKey } from '../../models/GuildSetting';
import { SettingsValueResolver } from '../../resolvers';
import { Command, Context } from '../Command';

interface ConfigMenu {
	items: [GuildSettingsKey, SettingsInfo<any>][];
	subMenus: SettingsGroup[];
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.interactiveConfig,
			aliases: ['ic'],
			args: [],
			group: CommandGroup.Config,
			botPermissions: [
				GuildPermission.ADD_REACTIONS,
				GuildPermission.MANAGE_MESSAGES,
				GuildPermission.READ_MESSAGE_HISTORY
			],
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	private prev: string = '⬅';
	private next: string = '➡';
	private up: string = '↩';
	private cancel: string = '❌';
	private choices: string[] = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

	public async action(message: Message, args: any[], flags: {}, context: Context): Promise<any> {
		const embed = this.createEmbed({
			title: 'InviteManager',
			description: 'Loading...'
		});

		// Ask users to use the webpanel on the regular bot
		if (this.client.type === BotType.regular) {
			embed.description = context.t('cmd.interactiveConfig.useWeb', {
				configCmd: `\`${context.settings.prefix}config\``,
				link: `https://app.invitemanager.gg/guild/${context.guild.id}/settings`
			});
			return this.sendReply(message, embed);
		}

		if (
			message.channel instanceof GuildChannel &&
			message.channel.permissionsOf(this.client.user.id).has(GuildPermission.MANAGE_MESSAGES)
		) {
			await message.delete().catch(() => undefined);
		}

		const msg = await this.sendReply(message, embed);
		if (!msg) {
			return;
		}

		for (let i = 0; i < this.choices.length; i++) {
			await msg.addReaction(this.choices[i]);
		}

		await msg.addReaction(this.prev);
		await msg.addReaction(this.next);
		await msg.addReaction(this.up);
		await msg.addReaction(this.cancel);

		while ((await this.showConfigMenu(context, message.author.id, msg, [])) === 'up') {
			// NOP
		}
	}

	private buildConfigMenu(path: SettingsGroup[] = []): ConfigMenu {
		const menu: ConfigMenu = {
			items: [],
			subMenus: []
		};

		Object.keys(guildSettingsInfo)
			.filter((key: GuildSettingsKey) => path.every((p, i) => guildSettingsInfo[key].grouping[i] === p))
			.forEach((key: GuildSettingsKey) => {
				const info = guildSettingsInfo[key];
				if (info.grouping.length === path.length) {
					menu.items.push([key, guildSettingsInfo[key]]);
				} else {
					const group = info.grouping[path.length];
					if (!menu.subMenus.includes(group)) {
						menu.subMenus.push(group);
					}
				}
			});

		return menu;
	}

	private async showConfigMenu(context: Context, authorId: string, msg: Message, path: SettingsGroup[]) {
		const t = context.t;
		const menu = this.buildConfigMenu(path);
		const basePath = path.map((p) => `${p}.`).join('');
		let page = 0;

		do {
			let title = 'InviteManager';
			for (let i = 0; i < path.length; i++) {
				title += ' - ' + t(`settings.groups.${path.slice(0, i + 1).join('.')}.title`);
			}

			// Compute these every time so that possible value changes are shown
			const allChoices = menu.subMenus
				.map((sub) => ({
					type: 'menu',
					value: sub as string,
					title: t(`settings.groups.${basePath}${sub}.title`),
					description: t(`settings.groups.${basePath}${sub}.description`)
				}))
				.concat(
					menu.items.map((item) => ({
						type: 'key',
						value: item[0],
						title: t(`settings.${item[0]}.title`),
						description: beautify(item[1].type, context.settings[item[0]])
					}))
				);

			// Only extract the page we need
			const choices = allChoices.slice(page * 10, (page + 1) * 10);

			const choice = await this.showMenu(
				context,
				msg,
				authorId,
				title,
				`Page: ${page + 1}/${Math.ceil(allChoices.length / 10.0)}`,
				choices
			);
			if (choice === undefined) {
				// Quit menu
				return;
			}
			if (choice === 'prev') {
				// Move to previous page of items
				if (page > 0) {
					page--;
				}
				continue;
			}
			if (choice === 'next') {
				// Move to next page of items
				if (page < Math.ceil(allChoices.length / 10.0) - 1) {
					page++;
				}
				continue;
			}
			if (choice === 'up') {
				// Move one menu up
				return 'up';
			}

			const sel = choices[choice];

			if (sel.type === 'key') {
				const key = sel.value as GuildSettingsKey;

				if (guildSettingsInfo[key].type === 'Boolean') {
					await this.client.cache.guilds.setOne(context.guild.id, key, context.settings[key] ? false : true);
				} else {
					const subChoice = await this.changeConfigSetting(context, authorId, msg, key);
					if (subChoice === undefined) {
						// Quit menu
						return;
					}
				}
			} else {
				const subChoice = await this.showConfigMenu(context, authorId, msg, path.concat([sel.value as SettingsGroup]));
				if (subChoice === undefined) {
					// Quit menu
					return;
				}
			}
		} while (true);
	}

	private async changeConfigSetting(context: Context, authorId: string, msg: Message, key: GuildSettingsKey) {
		const info = guildSettingsInfo[key];
		const isList = info.type.endsWith('[]');

		const title = key;
		const possible = info.possibleValues
			? info.possibleValues.map((v) => '`' + v + '`').join(', ')
			: context.t(`cmd.interactiveConfig.values.${info.type.toLowerCase()}`);

		let error: string = null;
		do {
			const val = context.settings[key];
			const current = beautify(info.type, val);
			const text = context.t('cmd.interactiveConfig.change', {
				current,
				possible
			});

			const description =
				context.t(`settings.${key}.description`) + `\n\n${text}\n\n${error ? '```diff\n- ' + error + '```\n\n' : ''}`;

			if (isList) {
				const listOptions = [
					{
						title: context.t('cmd.interactiveConfig.list.add.title'),
						description: context.t('cmd.interactiveConfig.list.add.text')
					},
					{
						title: context.t('cmd.interactiveConfig.list.remove.title'),
						description: context.t('cmd.interactiveConfig.list.remove.text')
					},
					{
						title: context.t('cmd.interactiveConfig.list.set.title'),
						description: context.t('cmd.interactiveConfig.list.set.text')
					},
					{
						title: context.t('cmd.interactiveConfig.list.clear.title'),
						description: context.t('cmd.interactiveConfig.list.clear.text')
					}
				];

				const choice = await this.showMenu(context, msg, authorId, title, description, listOptions, false);
				if (choice === undefined) {
					// Quit menu
					return;
				}
				if (choice === 'prev' || choice === 'next') {
					// Ignore invalid options
					continue;
				}
				if (choice === 'up') {
					// Move one menu up
					return 'up';
				}

				error = null;
				let newVal = undefined;
				if (choice === 0) {
					// Add item
					const embed = this.createEmbed({
						title,
						description: description + '**' + context.t('cmd.interactiveConfig.add') + '**'
					});
					await msg.edit({ embed });

					try {
						const rawNewVal = await this.parseInput(context, authorId, msg, key);
						if (typeof rawNewVal !== 'undefined') {
							error = this.validate(key, rawNewVal, context);
							if (error) {
								continue;
							}

							newVal = (val as string[])
								.concat(toDbValue(info, rawNewVal))
								.filter((v, i, list) => list.indexOf(v) === i);
						}
					} catch (err) {
						error = err.message;
						continue;
					}
				} else if (choice === 1) {
					// Remove item

					// Check empty
					if ((val as string[]).length === 0) {
						error = context.t('cmd.interactiveConfig.removeEmpty');
						continue;
					}

					const embed = this.createEmbed({
						title,
						description: description + '**' + context.t('cmd.interactiveConfig.remove') + '**'
					});
					await msg.edit({ embed });

					try {
						const rawNewVal = await this.parseInput(context, authorId, msg, key);
						if (typeof rawNewVal !== 'undefined') {
							newVal = (val as string[]).filter((v) => rawNewVal.indexOf(v) === -1);
						}
					} catch (err) {
						error = err.message;
						continue;
					}
				} else if (choice === 2) {
					// Set list
					const embed = this.createEmbed({
						title,
						description: description + '**' + context.t('cmd.interactiveConfig.set') + '**'
					});
					await msg.edit({ embed });

					try {
						const rawNewVal = await this.parseInput(context, authorId, msg, key);
						if (typeof rawNewVal !== 'undefined') {
							error = this.validate(key, rawNewVal, context);
							if (error) {
								continue;
							}

							newVal = toDbValue(info, rawNewVal);
						}
					} catch (err) {
						error = err.message;
					}
				} else if (choice === 3) {
					// Clear list
					newVal = [];
				}

				if (typeof newVal !== 'undefined') {
					await this.client.cache.guilds.setOne(context.guild.id, key, newVal);
				}
			} else {
				// Change a non-list setting
				const embed = this.createEmbed({
					title,
					description: description + '**' + context.t('cmd.interactiveConfig.new') + '**'
				});
				await msg.edit({ embed });

				try {
					const rawNewVal = await this.parseInput(context, authorId, msg, key);

					if (typeof rawNewVal === 'undefined') {
						return 'up';
					}

					error = this.validate(key, rawNewVal, context);
					if (error) {
						continue;
					}

					const newValue = toDbValue(info, rawNewVal);

					await this.client.cache.guilds.setOne(context.guild.id, key, newValue);
					return 'up';
				} catch (err) {
					error = err.message;
				}
			}
		} while (true);
	}

	private async parseInput(context: Context, authorId: string, msg: Message, key: GuildSettingsKey) {
		return new Promise<any>(async (resolve, reject) => {
			let timeOut: NodeJS.Timer;

			const func = async (userMsg: Message, emoji: Emoji, userId: string) => {
				clearTimeout(timeOut);
				this.client.removeListener('messageCreate', func);
				this.client.removeListener('messageReactionAdd', func);

				if (emoji && userId === authorId) {
					await msg.removeReaction(emoji.name, userId);
					resolve();
				} else if (userMsg.author && userMsg.author.id === authorId) {
					await userMsg.delete().catch(() => undefined);
					new SettingsValueResolver(this.client, guildSettingsInfo)
						.resolve(userMsg.content, context, [key])
						.then((v) => resolve(v))
						.catch((err) => reject(err));
				}
			};

			this.client.on('messageCreate', func);
			this.client.on('messageReactionAdd', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageCreate', func);
				this.client.removeListener('messageReactionAdd', func);

				resolve();
			};

			timeOut = setTimeout(timeOutFunc, 60000);
		});
	}

	private async showMenu(
		context: Context,
		msg: Message,
		authorId: string,
		title: string,
		description: string,
		items: { title: string; description: string }[],
		showWelcome: boolean = true
	) {
		const t = context.t;

		let welcomeText = '';
		if (showWelcome) {
			welcomeText =
				t('cmd.interactiveConfig.welcome', {
					prev: this.prev,
					next: this.next,
					up: this.up,
					cancel: this.cancel
				}) + '\n\n';
		}

		const embed = this.createEmbed({
			title,
			description: welcomeText + description,
			fields: items.map((item, i) => ({
				name: `${i + 1}. ${item.title}`,
				value: item.description !== null && item.description !== '' ? item.description : t('cmd.interactiveConfig.none')
			}))
		});

		do {
			const editMsg = await msg.edit({ embed }).catch(() => null as Message);
			if (editMsg === null) {
				// Quit menu on error
				return;
			}

			const choice = await this.awaitChoice(authorId, msg);
			if (choice === undefined) {
				// Quit menu
				return;
			}
			if (choice === 'up' || choice === 'prev' || choice === 'next') {
				// Move one menu up
				return choice;
			}
			if (choice >= items.length) {
				// Restart this menu
				continue;
			}

			// Return the choice the user picked
			return choice;
		} while (true);
	}

	private async awaitChoice(authorId: string, msg: Message) {
		return new Promise<'prev' | 'next' | 'up' | number>(async (resolve) => {
			let timeOut: NodeJS.Timer;
			const func = async (resp: Message, emoji: Emoji, userId: string) => {
				if (resp.id !== msg.id || authorId !== userId) {
					return;
				}

				clearTimeout(timeOut);
				this.client.removeListener('messageReactionAdd', func);

				if (emoji.name === this.cancel) {
					await msg.delete().catch(() => undefined);
					resolve();
					return;
				}

				const id = this.choices.indexOf(emoji.name);
				if ((resp.channel as GuildChannel).permissionsOf(this.client.user.id).has(GuildPermission.MANAGE_MESSAGES)) {
					await this.client.removeMessageReaction(resp.channel.id, resp.id, emoji.name, userId);
				}

				if (emoji.name === this.prev) {
					resolve('prev');
				} else if (emoji.name === this.next) {
					resolve('next');
				} else if (emoji.name === this.up) {
					resolve('up');
				} else {
					resolve(id);
				}
			};

			this.client.on('messageReactionAdd', func);

			const timeOutFunc = async () => {
				this.client.removeListener('messageReactionAdd', func);

				await msg.delete().catch(() => undefined);

				resolve(undefined);
			};

			timeOut = setTimeout(timeOutFunc, 60000);
		});
	}

	private validate(key: GuildSettingsKey, value: any, { t, isPremium, me }: Context): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		const info = guildSettingsInfo[key];

		if ((info.type === 'Channel' || info.type === 'Channel[]') && key !== GuildSettingsKey.ignoredChannels) {
			let channels = value as TextChannel[];
			if (info.type === 'Channel') {
				channels = [value as TextChannel];
			}

			for (const channel of channels) {
				if (!(channel instanceof TextChannel)) {
					return t('cmd.config.invalid.mustBeTextChannel');
				}
				if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
					return t('cmd.config.invalid.canNotReadMessages');
				}
				if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
					return t('cmd.config.invalid.canNotSendMessages');
				}
				if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
					return t('cmd.config.invalid.canNotSendEmbeds');
				}
			}
		} else if (key === GuildSettingsKey.joinRoles) {
			if (!isPremium && value && value.length > 1) {
				return t('cmd.config.invalid.multipleJoinRolesIsPremium');
			}
		}

		return null;
	}
}
