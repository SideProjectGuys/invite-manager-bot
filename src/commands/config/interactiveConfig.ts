import { Emoji, Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import { SettingsValueResolver } from '../../resolvers';
import {
	InviteCodeSettingsKey,
	Lang,
	LeaderboardStyle,
	MemberSettingsKey,
	RankAssignmentStyle,
	SettingsKey
} from '../../sequelize';
import { beautify, fromDbValue, settingsInfo, toDbValue } from '../../settings';
import { BotCommand, CommandGroup, Permissions } from '../../types';
import { Command, Context } from '../Command';

type ConfigMenu = { items: { [x: string]: ConfigMenu } } | SettingsKey;

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

	private back: string = '↩';
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
		'9⃣'
	];

	public async action(
		message: Message,
		args: any[],
		flags: {},
		context: Context
	): Promise<any> {
		const embed = this.client.createEmbed({
			title: 'InviteManager',
			description: 'Loading...'
		});

		message.delete();

		const msg = await this.client.sendReply(message, embed);

		for (let i = 0; i < 9; i++) {
			msg.addReaction(this.choices[i]);
		}

		msg.addReaction(this.back);
		msg.addReaction(this.cancel);

		while (
			(await this.showConfigMenu(context, message.author.id, msg, [], {
				items: {
					basic: {
						items: {
							prefix: SettingsKey.prefix,
							lang: SettingsKey.lang,
							logChannel: SettingsKey.logChannel,
							getUpdates: SettingsKey.getUpdates
						}
					},
					mod: {
						items: {
							general: {
								items: {
									enabled: SettingsKey.autoModEnabled,
									moderatedChannels: SettingsKey.autoModModeratedChannels,
									moderatedRoles: SettingsKey.autoModModeratedRoles,
									ignoredChannels: SettingsKey.autoModIgnoredChannels,
									ignoredRoles: SettingsKey.autoModIgnoredRoles,
									deleteBotMessages: SettingsKey.autoModDeleteBotMessage,
									deleteBotMessagesTimeout:
										SettingsKey.autoModDeleteBotMessageTimeoutInSeconds,
									mutedRole: SettingsKey.mutedRole
								}
							},
							logging: {
								items: {
									logChannel: SettingsKey.modLogChannel,
									autoLogEnabled: SettingsKey.autoModLogEnabled,
									deleteBotMessage: SettingsKey.autoModDeleteBotMessage,
									deleteMessageTimeout:
										SettingsKey.autoModDeleteBotMessageTimeoutInSeconds,
									deleteBanMessages: SettingsKey.modPunishmentBanDeleteMessage,
									deleteKickMessages:
										SettingsKey.modPunishmentKickDeleteMessage,
									deleteSoftBanMessages:
										SettingsKey.modPunishmentSoftbanDeleteMessage,
									deleteWarnMessages:
										SettingsKey.modPunishmentWarnDeleteMessage,
									deleteMuteMessages: SettingsKey.modPunishmentMuteDeleteMessage
								}
							},
							invitesAndLinks: {
								items: {
									invitesEnabled: SettingsKey.autoModInvitesEnabled,
									linksEnabled: SettingsKey.autoModLinksEnabled,
									linksWhitelist: SettingsKey.autoModLinksWhitelist,
									linksBlacklist: SettingsKey.autoModLinksBlacklist,
									followLinkRedirects: SettingsKey.autoModLinksFollowRedirects
								}
							},
							bannedWords: {
								items: {
									enabled: SettingsKey.autoModWordsEnabled,
									blacklist: SettingsKey.autoModWordsBlacklist
								}
							},
							caps: {
								items: {
									enabled: SettingsKey.autoModAllCapsEnabled,
									minCharacters: SettingsKey.autoModAllCapsMinCharacters,
									percentageCaps: SettingsKey.autoModAllCapsPercentageCaps
								}
							},
							duplicate: {
								items: {
									enabled: SettingsKey.autoModDuplicateTextEnabled,
									timeframe: SettingsKey.autoModDuplicateTextTimeframeInSeconds
								}
							},
							spam: {
								items: {
									enabled: SettingsKey.autoModQuickMessagesEnabled,
									numberOfMessages:
										SettingsKey.autoModQuickMessagesNumberOfMessages,
									timeframe: SettingsKey.autoModQuickMessagesTimeframeInSeconds
								}
							},
							mentions: {
								items: {
									usersEnabled: SettingsKey.autoModMentionUsersEnabled,
									usersMax: SettingsKey.autoModMentionUsersMaxNumberOfMentions,
									rolesEnabled: SettingsKey.autoModMentionRolesEnabled,
									rolesMax: SettingsKey.autoModMentionRolesMaxNumberOfMentions
								}
							},
							emojis: {
								items: {
									enabled: SettingsKey.autoModEmojisEnabled,
									max: SettingsKey.autoModEmojisMaxNumberOfEmojis
								}
							}
						}
					},
					captcha: {
						items: {
							enabled: SettingsKey.captchaVerificationOnJoin,
							welcome: SettingsKey.captchaVerificationWelcomeMessage,
							success: SettingsKey.captchaVerificationSuccessMessage,
							failed: SettingsKey.captchaVerificationFailedMessage,
							timeout: SettingsKey.captchaVerificationTimeout,
							logs: SettingsKey.captchaVerificationLogEnabled
						}
					},
					leaderboard: {
						items: {
							style: SettingsKey.leaderboardStyle,
							hideLeftMembers: SettingsKey.hideLeftMembersFromLeaderboard
						}
					},
					ranks: {
						items: {
							style: SettingsKey.rankAssignmentStyle,
							channel: SettingsKey.rankAnnouncementChannel,
							message: SettingsKey.rankAnnouncementMessage
						}
					},
					joinAndLeaveMessages: {
						items: {
							joinChannel: SettingsKey.joinMessageChannel,
							joinMessage: SettingsKey.joinMessage,
							leaveChannel: SettingsKey.leaveMessageChannel,
							leaveMessage: SettingsKey.leaveMessage
						}
					}
				}
			})) === -1
		) {
			// NOP
		}
	}

	private getTranslationKey(path: string[]) {
		return 'cmd.interactiveConfig.items.' + path.map(p => `${p}.`).join('');
	}

	private async showConfigMenu(
		context: Context,
		authorId: string,
		msg: Message,
		path: string[],
		menu: ConfigMenu
	) {
		if (typeof menu === 'string') {
			return -1;
		}

		const t = context.t;
		const keys = Object.keys(menu.items);
		const basePath = this.getTranslationKey(path);

		do {
			const title =
				'InviteManager - ' +
				path.map(p => `${p} - `).join('') +
				t(basePath + 'title');

			const choice = await this.showMenu(
				context,
				msg,
				authorId,
				title,
				'',
				keys.map((key, i) => {
					let val: any;
					if (typeof menu.items[key] === 'string') {
						const settingsKey = menu.items[key] as SettingsKey;
						val = beautify(settingsKey, context.settings[settingsKey]);
					} else {
						val = t(basePath + key + '.description');
					}

					if (val === null || val === '') {
						val = t('cmd.interactiveConfig.none');
					}
					return {
						title: t(basePath + key + '.title'),
						description: val
					};
				})
			);
			if (choice === undefined) {
				// Quit menu
				return;
			}
			if (choice === -1) {
				// Move one menu up
				return -1;
			}

			const subMenu = menu.items[keys[choice]];

			if (typeof subMenu === 'string') {
				const key = subMenu as SettingsKey;

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
					path.concat([keys[choice]]),
					subMenu
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
				if (choice === -1) {
					// Move one menu up
					return -1;
				}

				let newVal = undefined;
				if (choice === 0) {
					// Add item
					const embed = this.client.createEmbed({
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
					const embed = this.client.createEmbed({
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
					const embed = this.client.createEmbed({
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
				const embed = this.client.createEmbed({
					title,
					description:
						description + '**' + context.t('cmd.interactiveConfig.new') + '**'
				});
				await msg.edit({ embed });

				let newVal = await this.parseInput(context, authorId, msg, key);

				if (newVal !== undefined) {
					const err = this.validate(key, newVal, context);
					if (err) {
						embed.description = err;
						await msg.edit({ embed });
						newVal = undefined;
					}
				}
				await this.client.cache.settings.setOne(context.guild.id, key, newVal);
				return;
			}
		} while (true);
	}

	private async parseInput(
		context: Context,
		authorId: string,
		msg: Message,
		key: SettingsKey
	) {
		const info = settingsInfo[key];

		return new Promise<any>(async (resolve, reject) => {
			let timeOut: NodeJS.Timer;

			const func = async (userMsg: Message, emoji: Emoji, userId: string) => {
				if (userMsg.author.id === authorId) {
					const newRawVal = userMsg.content;

					await userMsg.delete();

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

					await msg.removeReaction(emoji.name, userId);

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
		const embed = this.client.createEmbed({
			title,
			description: t('cmd.interactiveConfig.welcome') + '\n\n' + description,
			fields: items.map((item, i) => ({
				name: `${i + 1}. ${item.title}`,
				value: `${item.description}`
			}))
		});

		do {
			await msg.edit({ embed });

			const choice = await this.awaitChoice(authorId, msg);
			if (choice === undefined) {
				// Quit menu
				return;
			}
			if (choice === -1) {
				// Move one menu up
				return -1;
			}
			if (choice >= items.length) {
				// Restart this menu
				continue;
			}

			// Return the choice the user picked
			return choice;
		} while (true);
	}

	private async awaitChoice(authorId: string, msg: Message): Promise<number> {
		return new Promise<number>(async resolve => {
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
				await resp.removeReaction(emoji.name, userId);

				if (emoji.name === this.back) {
					resolve(-1);
				} else {
					resolve(id);
				}
			};

			this.client.on('messageReactionAdd', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageReactionAdd', func);

				msg.delete();

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
