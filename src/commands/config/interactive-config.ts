import { Emoji, Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import { settingsDescription } from '../../exportConfigTypes';
import {
	BooleanResolver,
	ChannelResolver,
	NumberResolver,
	RoleResolver,
	StringResolver
} from '../../resolvers';
import { ArrayResolver } from '../../resolvers/ArrayResolver';
import {
	InviteCodeSettingsKey,
	Lang,
	LeaderboardStyle,
	MemberSettingsKey,
	RankAssignmentStyle,
	SettingsKey,
	settingsTypes
} from '../../sequelize';
import { BotCommand, CommandGroup, Permissions } from '../../types';
import { Command, Context } from '../Command';

type ConfigMenu =
	| { items: { [x: string]: ConfigMenu } }
	| SettingsKey
	| MemberSettingsKey
	| InviteCodeSettingsKey;

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
		context: Context
	): Promise<any> {
		let embed = this.client.createEmbed({
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

		const t = context.t;

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
									autoLogEnabled: SettingsKey.autoModLogEnabled,
									logChannel: SettingsKey.modLogChannel
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
					},
					memberSettings: {
						items: {
							hideFromLeaderboard: MemberSettingsKey.hideFromLeaderboard
						}
					},
					inviteCodeSettings: {
						items: {
							name: InviteCodeSettingsKey.name,
							roles: InviteCodeSettingsKey.roles
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
		ownerId: string,
		msg: Message,
		path: string[],
		menu: ConfigMenu
	) {
		if (typeof menu === 'string') {
			return -1;
		}

		const t = context.t;
		const embed = this.client.createEmbed();
		const keys = Object.keys(menu.items);
		const basePath = this.getTranslationKey(path);

		let choice: number;
		do {
			embed.title =
				'InviteManager - ' +
				path.map(p => `${p} - `).join('') +
				t(basePath + 'title');

			embed.description = t('cmd.interactiveConfig.welcome') + '\n\n';
			embed.fields = keys.map((key, i) => {
				let val: any;
				if (typeof menu.items[key] === 'string') {
					const settingsKey = menu.items[key] as SettingsKey;
					val = this.beautify(settingsKey, context.settings[settingsKey]);
				} else {
					val = t(basePath + key + '.description');
				}

				if (val === null) {
					val = t('cmd.interactiveConfig.none');
				}
				return {
					name: `${i + 1}. ${t(basePath + key + '.title')}`,
					value: `${val}`
				};
			});

			await msg.edit({ embed });

			choice = await this.awaitChoice(ownerId, msg);
			if (choice === undefined) {
				// Quit menu
				return;
			}
			if (choice === -1) {
				// Move one menu up
				return -1;
			}
			if (choice >= keys.length) {
				// Restart this menu
				choice = -1;
				continue;
			}

			const subMenu = menu.items[keys[choice]];

			if (typeof subMenu === 'string') {
				const key = subMenu as SettingsKey;
				const currentVal = context.settings[key];
				let newVal = undefined;
				if (settingsTypes[key] === 'Boolean') {
					if (currentVal === true) {
						newVal = false;
					} else {
						newVal = true;
					}
				} else {
					newVal = await this.changeConfigSetting(
						context,
						ownerId,
						msg,
						key,
						currentVal
					);
					if (newVal !== undefined) {
						const err = this.validate(key, newVal, context);
						if (err) {
							embed.description = err;
							await msg.edit({ embed });
							newVal = undefined;
						}
					}
				}
				if (newVal) {
					await this.client.cache.settings.setOne(
						context.guild.id,
						key,
						newVal
					);
				}
				choice = -1;
			} else {
				choice = await this.showConfigMenu(
					context,
					ownerId,
					msg,
					path.concat([keys[choice]]),
					subMenu
				);
				if (choice === undefined) {
					return;
				}
			}
		} while (choice === -1);
	}

	private async changeConfigSetting(
		context: Context,
		ownerId: string,
		msg: Message,
		key: SettingsKey,
		val: any
	): Promise<string> {
		return new Promise<string>(async resolve => {
			const info = settingsDescription[key];
			const type = settingsTypes[key];

			const current = this.beautify(key, val);
			const possible = info && info.possibleValues
				? info.possibleValues.map(v => '`' + v + '`').join(', ')
				: context.t(`cmd.interactiveConfig.values.${type.toLowerCase()}`);

			const description =
				(info ? (info.description + '\n\n') : '') +
				context.t('cmd.interactiveConfig.change', {
					current,
					possible
				});

			const embed = this.client.createEmbed({
				title: `${key}`,
				description
			});
			await msg.edit({ embed });

			let timeOut: NodeJS.Timer;

			const func = async (userMsg: Message, emoji: Emoji, userId: string) => {
				if (userMsg.author.id === ownerId) {
					const newRawVal = userMsg.content;

					await userMsg.delete();

					let newVal: any;
					try {
						switch (type) {
							case 'Channel':
								newVal = await new ChannelResolver(this.client).resolve(
									newRawVal,
									context
								);
								break;

							case 'Channel[]':
								newVal = await new ArrayResolver(
									this.client,
									ChannelResolver
								).resolve(newRawVal, context, []);
								break;

							case 'Role':
								newVal = await new RoleResolver(this.client).resolve(
									newRawVal,
									context
								);
								break;

							case 'Role[]':
								newVal = await new ArrayResolver(
									this.client,
									RoleResolver
								).resolve(newRawVal, context, []);
								break;

							case 'Boolean':
								newVal = await new BooleanResolver(this.client).resolve(
									newRawVal,
									context
								);
								break;

							case 'Number':
								newVal = await new NumberResolver(this.client).resolve(
									newRawVal,
									context
								);
								break;

							case 'String':
								newVal = newRawVal;
								break;

							case 'String[]':
								newVal = await new ArrayResolver(
									this.client,
									StringResolver
								).resolve(newRawVal, context, []);
								break;

							default:
								break;
						}
					} catch (err) {
						newVal = undefined;
						embed.description = description + '\n\n' + err.message;
						await msg.edit({ embed });
						return;
					}

					clearTimeout(timeOut);
					this.client.removeListener('messageCreate', func);
					this.client.removeListener('messageReactionAdd', func);
					this.client.setMaxListeners(this.client.getMaxListeners() - 1);

					resolve(newVal);
				} else if (emoji && userId === ownerId) {
					clearTimeout(timeOut);
					this.client.removeListener('messageCreate', func);
					this.client.removeListener('messageReactionAdd', func);
					this.client.setMaxListeners(this.client.getMaxListeners() - 1);

					await msg.removeReaction(emoji.name, userId);

					resolve();
				}
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 2);
			this.client.on('messageCreate', func);
			this.client.on('messageReactionAdd', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageCreate', func);
				this.client.removeListener('messageReactionAdd', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 2);

				resolve();
			};

			timeOut = setTimeout(timeOutFunc, 60000);
		});
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
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

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

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageReactionAdd', func);

			const timeOutFunc = () => {
				this.client.removeListener('messageReactionAdd', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

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

		const type = settingsTypes[key];

		if (type === 'Channel') {
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

	private beautify(key: SettingsKey, value: any) {
		if (typeof value === typeof undefined || value === null) {
			return null;
		}

		const type = settingsTypes[key];
		if (type === 'Channel') {
			return `<#${value}>`;
		} else if (type === 'Boolean') {
			return value ? 'True' : 'False';
		} else if (type === 'Role') {
			return `<@&${value}>`;
		} else if (type === 'Role[]') {
			return value.map((v: any) => `<@&${v}>`).join(' ');
		} else if (type === 'Channel[]') {
			return value.map((v: any) => `<#${v}>`).join(' ');
		} else if (type === 'String[]') {
			return value.map((v: any) => '`' + v + '`').join(', ');
		}
		if (typeof value === 'string' && value.length > 1000) {
			return value.substr(0, 1000) + '...';
		}
		return value;
	}
}
