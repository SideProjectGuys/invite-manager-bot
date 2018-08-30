import { Message, Emoji } from 'eris';

import { IMClient } from '../../client';
import {
	BooleanResolver,
	ChannelResolver,
	EnumResolver,
	NumberResolver,
	Resolver
} from '../../resolvers';
import { SettingsKey, SettingsObject } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

type ConfigMenu =
	| { text?: string; items: { [x: string]: ConfigMenu } }
	| SettingsKey;

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
		{ guild, settings }: Context
	): Promise<any> {
		let embed = this.client.createEmbed({
			title: 'InviteManager',
			description: 'Loading settings interface...'
		});

		message.delete();

		const msg = await this.client.sendReply(message, embed);
		for (let i = 0; i < 9; i++) {
			await msg.addReaction(this.choices[i]);
		}
		await msg.addReaction(this.back);
		await msg.addReaction(this.cancel);

		await this.showConfigMenu(
			guild.id,
			message.author.id,
			msg,
			{
				text:
					'Welcome to the InviteManager settings. What settings would you like to view or change?',
				items: {
					'General settings': {
						title: 'InviteManager - General Settings',
						text:
							'Which of the following general settings category would you like to view?',
						items: {
							AutoMod: {
								text:
									'Which of the following general AutoMod category would you like to view?',
								items: {
									General: {
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
										items: {
											Enabled: SettingsKey.autoModWordsEnabled,
											Blacklist: SettingsKey.autoModWordsBlacklist
										}
									},
									Caps: {
										items: {
											Enabled: SettingsKey.autoModAllCapsEnabled,
											'Min Characters': SettingsKey.autoModAllCapsMinCharacters,
											'Percentage Caps':
												SettingsKey.autoModAllCapsPercentageCaps
										}
									},
									Duplicate: {
										items: {
											Enabled: SettingsKey.autoModDuplicateTextEnabled,
											Timeframe:
												SettingsKey.autoModDuplicateTextTimeframeInSeconds
										}
									},
									Spam: {
										items: {
											Enabled: SettingsKey.autoModQuickMessagesEnabled,
											'Number of messages':
												SettingsKey.autoModQuickMessagesNumberOfMessages,
											Timeframe:
												SettingsKey.autoModQuickMessagesTimeframeInSeconds
										}
									},
									Mentions: {
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
										items: {
											Enabled: SettingsKey.autoModEmojisEnabled,
											Max: SettingsKey.autoModEmojisMaxNumberOfEmojis
										}
									}
								}
							},
							Captcha: {
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
								items: {
									Style: SettingsKey.leaderboardStyle,
									'Hide left members':
										SettingsKey.hideLeftMembersFromLeaderboard
								}
							},
							Ranks: {
								items: {
									Style: SettingsKey.rankAssignmentStyle,
									Channel: SettingsKey.rankAnnouncementChannel,
									Message: SettingsKey.rankAnnouncementMessage
								}
							},
							'Join & Leave Message': {
								items: {
									'Join Channel': SettingsKey.joinMessageChannel,
									'Join Message': SettingsKey.joinMessage,
									'Leave Channel': SettingsKey.leaveMessageChannel,
									'Laeve Message': SettingsKey.leaveMessage
								}
							}
						}
					}
				}
			},
			settings,
			'InviteManager'
		);

		msg.delete();
	}

	private async showConfigMenu(
		guildId: string,
		ownerId: string,
		msg: Message,
		menu: ConfigMenu,
		settings: SettingsObject,
		title?: string
	) {
		if (typeof menu === 'string') {
			return -1;
		}

		const embed = this.client.createEmbed();
		const keys = Object.keys(menu.items);

		let choice: number;
		do {
			embed.title = title;
			embed.description =
				`${
					menu.text
						? menu.text
						: 'This is a list of all settings and their values:'
				}\n\n` +
				keys
					.map((key, i) => {
						const val =
							typeof menu.items[key] === 'string'
								? `: **${settings[menu.items[key] as SettingsKey]}**`
								: '';
						return `${i + 1}. ${key}${val}`;
					})
					.join('\n');

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
				const currentVal = settings[key];
				let newVal = undefined;
				if (currentVal === 'true') {
					newVal = 'false';
				} else if (currentVal === 'false') {
					newVal = 'true';
				} else {
					newVal = await this.changeConfigSetting(
						guildId,
						ownerId,
						msg,
						key,
						currentVal
					);
				}
				if (newVal) {
					await this.client.cache.set(guildId, key, newVal);
				}
				choice = -1;
			} else {
				choice = await this.showConfigMenu(
					guildId,
					ownerId,
					msg,
					subMenu,
					settings,
					title + ' - ' + keys[choice]
				);
				if (choice === undefined) {
					return;
				}
			}
		} while (choice === -1);
	}

	private async changeConfigSetting(
		guildId: string,
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

			const func = async (msg: Message) => {
				if (msg.author.id === ownerId) {
					const val = msg.content;
					await msg.delete();

					this.client.removeListener('messageCreate', func);
					this.client.setMaxListeners(this.client.getMaxListeners() - 1);

					resolve(val);
				}
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageCreate', func);

			const timeOut = () => {
				this.client.removeListener('messageCreate', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

				resolve();
			};

			setTimeout(timeOut, 60000);
		});
	}

	private back = '↩';
	private cancel = '❌';
	private choices = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];

	private async awaitChoice(authorId: string, msg: Message): Promise<number> {
		return new Promise<number>(async resolve => {
			const func = async (resp: Message, emoji: Emoji, userId: string) => {
				if (resp.id !== msg.id || authorId !== userId) {
					return;
				}

				if (emoji.name === this.back) {
					resolve(-1);
				}

				if (emoji.name === this.cancel) {
					await msg.delete();
					resolve();
				}

				const id = this.choices.indexOf(emoji.name);
				await resp.removeReaction(emoji.name, userId);

				this.client.removeListener('messageReactionAdd', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

				resolve(id);
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageReactionAdd', func);

			const timeOut = () => {
				this.client.removeListener('messageReactionAdd', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

				resolve(undefined);
			};

			setTimeout(timeOut, 60000);
		});
	}
}
