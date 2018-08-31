import { Emoji, Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import {
	BooleanResolver,
	ChannelResolver,
	NumberResolver
} from '../../resolvers';
import {
	getSettingsType,
	InviteCodeSettingsKey,
	MemberSettingsKey,
	SettingsKey,
	Lang,
	LeaderboardStyle,
	RankAssignmentStyle
} from '../../sequelize';
import { BotCommand, CommandGroup, Permissions } from '../../types';
import { Command, Context } from '../Command';

type ConfigMenu =
	| { descr?: string; items: { [x: string]: ConfigMenu } }
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
		const more = { maxChoices: 0 };

		while (
			(await this.showConfigMenu(
				context,
				message.author.id,
				msg,
				'InviteManager',
				{
					items: {
						'General settings': {
							descr:
								'General settings for the InviteManager. Includes AutoMod settings, Join & Leave messages and more.',
							items: {
								AutoMod: {
									descr: 'Auto moderation settings.',
									items: {
										General: {
											descr: 'General AutoMod settings',
											items: {
												Enabled: SettingsKey.autoModEnabled,
												'Moderated Channels':
													SettingsKey.autoModModeratedChannels,
												'Moderated Roles': SettingsKey.autoModModeratedRoles,
												'Ignored Channels': SettingsKey.autoModIgnoredChannels,
												'Ignored Roles': SettingsKey.autoModIgnoredRoles,
												'Delete Bot Messages':
													SettingsKey.autoModDeleteBotMessage,
												'Delete Bot Messages Timeout':
													SettingsKey.autoModDeleteBotMessageTimeoutInSeconds,
												'Log Enabled': SettingsKey.autoModLogEnabled
											}
										},
										'Invites & Links': {
											descr: 'Removal of links and discord invites.',
											items: {
												'Invites Enabled': SettingsKey.autoModInvitesEnabled,
												'Links Enabled': SettingsKey.autoModLinksEnabled,
												'Links whitelist': SettingsKey.autoModLinksWhitelist,
												'Links Blacklist': SettingsKey.autoModLinksBlacklist,
												'Follow link redirects':
													SettingsKey.autoModLinksFollowRedirects
											}
										},
										'Banned words': {
											descr: 'Blacklist certain words.',
											items: {
												Enabled: SettingsKey.autoModWordsEnabled,
												Blacklist: SettingsKey.autoModWordsBlacklist
											}
										},
										Caps: {
											descr: 'Remove ALL-CAPS messages.',
											items: {
												Enabled: SettingsKey.autoModAllCapsEnabled,
												'Min Characters':
													SettingsKey.autoModAllCapsMinCharacters,
												'Percentage Caps':
													SettingsKey.autoModAllCapsPercentageCaps
											}
										},
										Duplicate: {
											descr: 'No more copy-pasta.',
											items: {
												Enabled: SettingsKey.autoModDuplicateTextEnabled,
												Timeframe:
													SettingsKey.autoModDuplicateTextTimeframeInSeconds
											}
										},
										Spam: {
											descr: 'Repeated sending of the same message.',
											items: {
												Enabled: SettingsKey.autoModQuickMessagesEnabled,
												'Number of messages':
													SettingsKey.autoModQuickMessagesNumberOfMessages,
												Timeframe:
													SettingsKey.autoModQuickMessagesTimeframeInSeconds
											}
										},
										Mentions: {
											descr: 'Stop mentions of lots of users or roles.',
											items: {
												'Users Enabled': SettingsKey.autoModMentionUsersEnabled,
												'Users Max':
													SettingsKey.autoModMentionUsersMaxNumberOfMentions,
												'Roles Enabled': SettingsKey.autoModMentionRolesEnabled,
												'Roles Max':
													SettingsKey.autoModMentionRolesMaxNumberOfMentions
											}
										},
										Emojis: {
											descr: 'Ban messages with too many emojis.',
											items: {
												Enabled: SettingsKey.autoModEmojisEnabled,
												Max: SettingsKey.autoModEmojisMaxNumberOfEmojis
											}
										}
									}
								},
								Captcha: {
									descr:
										'Settings related to the captcha verification of InviteManager',
									items: {
										Enabled: SettingsKey.captchaVerificationOnJoin,
										Welcome: SettingsKey.captchaVerificationWelcomeMessage,
										Success: SettingsKey.captchaVerificationSuccessMessage,
										Failed: SettingsKey.captchaVerificationFailedMessage,
										Timeout: SettingsKey.captchaVerificationTimeout,
										Logs: SettingsKey.captchaVerificationLogEnabled
									}
								},
								Leaderboard: {
									descr: 'Customize the invites leaderboard.',
									items: {
										Style: SettingsKey.leaderboardStyle,
										'Hide left members':
											SettingsKey.hideLeftMembersFromLeaderboard
									}
								},
								Ranks: {
									descr: 'Adjust settings related to ranks on your server.',
									items: {
										Style: SettingsKey.rankAssignmentStyle,
										Channel: SettingsKey.rankAnnouncementChannel,
										Message: SettingsKey.rankAnnouncementMessage
									}
								},
								'Join & Leave Message': {
									descr:
										'Change the join and leave messages, and where they are posted.',
									items: {
										'Join Channel': SettingsKey.joinMessageChannel,
										'Join Message': SettingsKey.joinMessage,
										'Leave Channel': SettingsKey.leaveMessageChannel,
										'Laeve Message': SettingsKey.leaveMessage
									}
								}
							}
						},
						'Member Settings': {
							desc: 'Settings related to individual members of your server.',
							items: {
								HideFromLeaderboard: MemberSettingsKey.hideFromLeaderboard
							}
						},
						'Invite Code Settings': {
							desc:
								'Settings related to individual invite codes on your server.',
							items: {
								Name: InviteCodeSettingsKey.name,
								Roles: InviteCodeSettingsKey.roles
							}
						}
					}
				},
				more
			)) === -1
		) {
			// NOP
		}
	}

	private async showConfigMenu(
		context: Context,
		ownerId: string,
		msg: Message,
		title: string,
		menu: ConfigMenu,
		more: { maxChoices?: number }
	) {
		if (typeof menu === 'string') {
			return -1;
		}

		const embed = this.client.createEmbed();
		const keys = Object.keys(menu.items);

		const currChoices = more.maxChoices;
		more.maxChoices = Math.max(more.maxChoices, keys.length);

		if (more.maxChoices > currChoices) {
			if (currChoices > 0) {
				embed.description = 'Loading...';
				await msg.edit({ embed });

				await msg.removeReaction(this.back);
				await msg.removeReaction(this.cancel);
			}

			for (let i = currChoices; i < more.maxChoices; i++) {
				await msg.addReaction(this.choices[i]);
			}

			await msg.addReaction(this.back);
			await msg.addReaction(this.cancel);
		}

		let choice: number;
		do {
			embed.title = title;
			embed.description =
				`Welcome to the InviteManager settings menu.\n` +
				`Use the reactions to pick one of the available options.\n\n`;
			embed.fields = keys.map((key, i) => {
				let val =
					typeof menu.items[key] === 'string'
						? context.settings[menu.items[key] as SettingsKey]
						: (menu.items[key] as any).descr;
				if (!val) {
					val = '<None>';
				}
				return {
					name: `${i + 1}. ${key}`,
					value: val
				};
			});

			await msg.edit({ embed });

			choice = await this.awaitChoice(ownerId, msg);
			if (choice === undefined) {
				return;
			}
			if (choice === -1) {
				return -1;
			}

			const subMenu = menu.items[keys[choice]];

			if (typeof subMenu === 'string') {
				const key = subMenu as SettingsKey;
				const currentVal = context.settings[key];
				let newVal = undefined;
				if (currentVal === 'true') {
					newVal = 'false';
				} else if (currentVal === 'false') {
					newVal = 'true';
				} else {
					newVal = await this.changeConfigSetting(
						context,
						ownerId,
						msg,
						key,
						currentVal
					);
					if (newVal) {
						const err = this.validate(key, newVal, context);
						if (err) {
							embed.description = err;
							await msg.edit({ embed });
							newVal = undefined;
						}
					}
				}
				if (newVal) {
					await this.client.cache.set(context.guild.id, key, newVal);
				}
				choice = -1;
			} else {
				choice = await this.showConfigMenu(
					context,
					ownerId,
					msg,
					title + ' - ' + keys[choice],
					subMenu,
					more
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
		val: string
	): Promise<string> {
		return new Promise<string>(async resolve => {
			const embed = this.client.createEmbed({
				title: `Edit ${key}`,
				description: `Current value: ${val}\n\nEnter a new value:`
			});
			await msg.edit({ embed });

			const func = async (userMsg: Message, emoji: Emoji, userId: string) => {
				if (userMsg.author.id === ownerId) {
					const newRawVal = userMsg.content;

					let newVal: any;
					try {
						switch (getSettingsType(key)) {
							case 'Channel':
								newVal = await new ChannelResolver(this.client).resolve(
									newRawVal,
									context
								);
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

							default:
								break;
						}
					} catch (err) {
						newVal = undefined;
					}

					await userMsg.delete();

					this.client.removeListener('messageCreate', func);
					this.client.removeListener('messageReactionAdd', func);
					this.client.setMaxListeners(this.client.getMaxListeners() - 1);

					resolve(newVal);
				} else if (emoji && userId === ownerId) {
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

			const timeOut = setTimeout(timeOutFunc, 60000);
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

	private async awaitChoice(authorId: string, msg: Message): Promise<number> {
		return new Promise<number>(async resolve => {
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

			const timeOut = setTimeout(timeOutFunc, 60000);
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

		const type = getSettingsType(key);

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
}
