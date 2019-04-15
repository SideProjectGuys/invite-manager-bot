import { Emoji, Message, TextChannel } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { SettingsValueResolver } from '../../../../framework/resolvers';
import {
	Lang,
	LeaderboardStyle,
	RankAssignmentStyle,
	SettingsKey
} from '../../../../sequelize';
import {
	beautify,
	fromDbValue,
	SettingsGroup,
	settingsInfo,
	toDbValue
} from '../../../../settings';
import { BotCommand, CommandGroup, Permissions } from '../../../../types';

interface ConfigMenu {
	items: SettingsKey[];
	subMenus: SettingsGroup[];
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.interactiveConfig,
			aliases: ['ic'],
			args: [],
			group: CommandGroup.Config,
			guildOnly: true,
			strict: true
		});
	}

	private prev: string = '⬅';
	private next: string = '➡';
	private up: string = '↩';
	private cancel: string = '❌';
	private choices: string[] = [
		'1⃣',
		'2⃣',
		'3⃣',
		'4⃣',
		'5⃣',
		'6⃣',
		'7⃣',
		'8⃣',
		'9⃣',
		'🔟'
	];

	public async action(
		message: Message,
		args: any[],
		flags: {},
		context: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: 'InviteManager',
			description: 'Loading...'
		});

		message.delete().catch(() => undefined);

		const msg = await this.sendReply(message, embed);

		for (let i = 0; i < this.choices.length; i++) {
			msg.addReaction(this.choices[i]).catch(() => undefined);
		}

		msg.addReaction(this.prev).catch(() => undefined);
		msg.addReaction(this.next).catch(() => undefined);
		msg.addReaction(this.up).catch(() => undefined);
		msg.addReaction(this.cancel).catch(() => undefined);

		while (
			(await this.showConfigMenu(context, message.author.id, msg, [])) === 'up'
		) {
			// NOP
		}
	}

	private buildConfigMenu(path: SettingsGroup[] = []): ConfigMenu {
		const menu: ConfigMenu = {
			items: [],
			subMenus: []
		};

		Object.keys(settingsInfo)
			.filter((key: SettingsKey) =>
				path.every((p, i) => settingsInfo[key].grouping[i] === p)
			)
			.forEach((key: SettingsKey) => {
				const info = settingsInfo[key];
				if (info.grouping.length === path.length) {
					menu.items.push(key);
				} else {
					const group = info.grouping[path.length];
					if (!menu.subMenus.includes(group)) {
						menu.subMenus.push(group);
					}
				}
			});

		return menu;
	}

	private async showConfigMenu(
		context: Context,
		authorId: string,
		msg: Message,
		path: SettingsGroup[]
	) {
		const t = context.t;
		const menu = this.buildConfigMenu(path);
		const basePath = path.map(p => `${p}.`).join('');
		let page = 0;

		do {
			let title = 'InviteManager';
			for (let i = 0; i < path.length; i++) {
				title +=
					' - ' + t(`settings.groups.${path.slice(0, i + 1).join('.')}.title`);
			}

			// Compute these every time so that possible value changes are shown
			const allChoices = menu.subMenus
				.map(sub => ({
					type: 'menu',
					value: sub as string,
					title: t(`settings.groups.${basePath}${sub}.title`),
					description: t(`settings.groups.${basePath}${sub}.description`)
				}))
				.concat(
					menu.items.map(item => ({
						type: 'key',
						value: item as string,
						title: t(`settings.${item}.title`),
						description: beautify(item, context.settings[item])
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
				const key = sel.value as SettingsKey;

				if (settingsInfo[key].type === 'Boolean') {
					await this.client.cache.settings.setOne(
						context.guild.id,
						key,
						context.settings[key] ? false : true
					);
				} else {
					const subChoice = await this.changeConfigSetting(
						context,
						authorId,
						msg,
						key
					);
					if (subChoice === undefined) {
						// Quit menu
						return;
					}
				}
			} else {
				const subChoice = await this.showConfigMenu(
					context,
					authorId,
					msg,
					path.concat([sel.value as SettingsGroup])
				);
				if (subChoice === undefined) {
					// Quit menu
					return;
				}
			}
		} while (true);
	}

	private async changeConfigSetting(
		context: Context,
		authorId: string,
		msg: Message,
		key: SettingsKey
	) {
		const info = settingsInfo[key];
		const isList = info.type.endsWith('[]');

		const title = key;
		const possible = info.possibleValues
			? info.possibleValues.map(v => '`' + v + '`').join(', ')
			: context.t(`cmd.interactiveConfig.values.${info.type.toLowerCase()}`);

		let error = '';
		do {
			const val = context.settings[key];
			const current = beautify(key, val);
			const text = context.t('cmd.interactiveConfig.change', {
				current,
				possible
			});

			const description =
				context.t(`settings.${key}.description`) +
				`\n\n${text}\n\n**${error}**`;

			if (isList) {
				const choice = await this.showMenu(
					context,
					msg,
					authorId,
					title,
					description,
					[
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
					]
				);
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

				let newVal = undefined;
				if (choice === 0) {
					// Add item
					const embed = this.createEmbed({
						title,
						description:
							description + '**' + context.t('cmd.interactiveConfig.add') + '**'
					});
					await msg.edit({ embed });

					const rawNewVal = await this.parseInput(context, authorId, msg, key);

					if (typeof rawNewVal !== 'undefined') {
						newVal = (val as string[])
							.concat(rawNewVal)
							.filter((v, i, list) => list.indexOf(v) === i);
					} else {
						newVal = val;
					}
				} else if (choice === 1) {
					if ((val as string[]).length === 0) {
						error = context.t('cmd.interactiveConfig.removeEmpty');
						continue;
					}

					// Remove item
					const embed = this.createEmbed({
						title,
						description:
							description +
							'**' +
							context.t('cmd.interactiveConfig.remove') +
							'**'
					});
					await msg.edit({ embed });

					const rawNewVal = await this.parseInput(context, authorId, msg, key);

					if (typeof rawNewVal !== 'undefined') {
						newVal = (val as string[]).filter(v => rawNewVal.indexOf(v) === -1);
					} else {
						newVal = val;
					}
				} else if (choice === 2) {
					// Set list
					const embed = this.createEmbed({
						title,
						description:
							description + '**' + context.t('cmd.interactiveConfig.set') + '**'
					});
					await msg.edit({ embed });

					const rawNewVal = await this.parseInput(context, authorId, msg, key);

					if (typeof rawNewVal !== 'undefined') {
						newVal = rawNewVal;
					} else {
						newVal = val;
					}
				} else if (choice === 3) {
					// Clear list
					newVal = [];
				}

				if (typeof newVal !== 'undefined') {
					const err = this.validate(key, newVal, context);
					if (err) {
						error = err;
					} else {
						error = '';
						await this.client.cache.settings.setOne(
							context.guild.id,
							key,
							newVal
						);
					}
				}
			} else {
				// Change a non-list setting
				const embed = this.createEmbed({
					title,
					description:
						description + '**' + context.t('cmd.interactiveConfig.new') + '**'
				});
				await msg.edit({ embed });

				const newVal = await this.parseInput(context, authorId, msg, key);

				if (typeof newVal === 'undefined') {
					return 'up';
				}

				const err = this.validate(key, newVal, context);
				if (err) {
					embed.description = err;
					await msg.edit({ embed });
				} else {
					await this.client.cache.settings.setOne(
						context.guild.id,
						key,
						newVal
					);
					return 'up';
				}
			}
		} while (true);
	}

	private async parseInput(
		context: Context,
		authorId: string,
		msg: Message,
		key: SettingsKey
	) {
		return new Promise<any>(async (resolve, reject) => {
			let timeOut: NodeJS.Timer;

			const func = async (userMsg: Message, emoji: Emoji, userId: string) => {
				if (userMsg.author.id === authorId) {
					const newRawVal = userMsg.content;

					await userMsg.delete().catch(() => undefined);

					let newVal: any;

					try {
						newVal = await new SettingsValueResolver(
							this.client,
							settingsInfo
						).resolve(newRawVal, context, [key]);
					} catch (err) {
						reject(err.message);
						return;
					}

					clearTimeout(timeOut);
					this.client.removeListener('messageCreate', func);
					this.client.removeListener('messageReactionAdd', func);

					resolve(fromDbValue(key, toDbValue(key, newVal)));
				} else if (emoji && userId === authorId) {
					clearTimeout(timeOut);
					this.client.removeListener('messageCreate', func);
					this.client.removeListener('messageReactionAdd', func);

					await msg.removeReaction(emoji.name, userId).catch(() => undefined);

					resolve();
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
		items: { title: string; description: string }[]
	) {
		const t = context.t;
		const embed = this.createEmbed({
			title,
			description: t('cmd.interactiveConfig.welcome') + '\n\n' + description,
			fields: items.map((item, i) => ({
				name: `${i + 1}. ${item.title}`,
				value:
					item.description !== null && item.description !== ''
						? item.description
						: t('cmd.interactiveConfig.none')
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
		return new Promise<'prev' | 'next' | 'up' | number>(async resolve => {
			let timeOut: NodeJS.Timer;
			const func = async (resp: Message, emoji: Emoji, userId: string) => {
				if (resp.id !== msg.id || authorId !== userId) {
					return;
				}

				clearTimeout(timeOut);
				this.client.removeListener('messageReactionAdd', func);

				if (emoji.name === this.cancel) {
					await msg.delete();
					resolve();
					return;
				}

				const id = this.choices.indexOf(emoji.name);
				await resp.removeReaction(emoji.name, userId).catch(() => undefined);

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

			const timeOutFunc = () => {
				this.client.removeListener('messageReactionAdd', func);

				msg.delete().catch(() => undefined);

				resolve(undefined);
			};

			timeOut = setTimeout(timeOutFunc, 60000);
		});
	}

	private validate(
		key: SettingsKey,
		value: any,
		{ t, me }: Context
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		const info = settingsInfo[key];

		if (info.type === 'Channel') {
			const channel = value as TextChannel;
			if (!channel.permissionsOf(me.id).has(Permissions.READ_MESSAGES)) {
				return t('cmd.config.channel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(Permissions.SEND_MESSAGES)) {
				return t('cmd.config.channel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(Permissions.EMBED_LINKS)) {
				return t('cmd.config.channel.canNotSendEmbeds');
			}
		}
		if (key === SettingsKey.lang) {
			if (!Lang[value]) {
				const langs = Object.keys(Lang)
					.map(k => `**${k}**`)
					.join(', ');
				return t('cmd.config.invalid.lang', { value, langs });
			}
		}
		if (key === SettingsKey.leaderboardStyle) {
			if (!LeaderboardStyle[value]) {
				const styles = Object.keys(LeaderboardStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return t('cmd.config.invalid.leaderboardStyle', { value, styles });
			}
		}
		if (key === SettingsKey.rankAssignmentStyle) {
			if (!RankAssignmentStyle[value]) {
				const styles = Object.keys(RankAssignmentStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return t('cmd.config.invalid.rankAssignmentStyle', { value, styles });
			}
		}

		return null;
	}
}
