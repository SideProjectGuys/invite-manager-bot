import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BasicUser, SettingsInfo } from '../../../types';
import { MemberSettingsCache } from '../../cache/MemberSettings';
import { Cache } from '../../decorators/Cache';
import { Service } from '../../decorators/Service';
import { LogAction } from '../../models/Log';
import { Member } from '../../models/Member';
import { EnumResolver, SettingsValueResolver, UserResolver } from '../../resolvers';
import { SettingsService } from '../../services/Settings';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	@Service() private settings: SettingsService;
	@Cache() private memberSettingsCache: MemberSettingsCache;

	private settingsInfos: Map<string, SettingsInfo<any>>;

	public constructor(client: IMClient) {
		super(client, {
			name: 'memberConfig',
			aliases: ['member-config', 'memconf', 'mc'],
			args: [
				{
					name: 'key',
					resolver: null, // setup later
					required: true
				},
				{
					name: 'user',
					resolver: UserResolver
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, Member),
					rest: true
				}
			],
			group: 'Config',
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async init() {
		this.settingsInfos = this.settings.getSettingsInfos(Member);
		this.args[0].resolver = new EnumResolver(this.client, [...this.settingsInfos.keys()]);

		await super.init();
	}

	public async action(
		message: Message,
		[key, user, value]: [string, BasicUser, any],
		flags: {},
		context: CommandContext
	): Promise<any> {
		const { guild, t, settings } = context;
		const prefix = settings.prefix;
		const embed = this.createEmbed();

		const info = this.settingsInfos.get(key);

		if (!user) {
			const allSets = await this.memberSettingsCache.get<any>(guild.id);
			if (allSets.size > 0) {
				allSets.forEach((set, memberId) =>
					embed.fields.push({
						name: guild.members.get(memberId).username,
						value: this.settings.beautify(info.type, set[key])
					})
				);
			} else {
				embed.description = t('cmd.memberConfig.notSet');
			}
			return this.sendReply(message, embed);
		}

		const memSettings = await this.memberSettingsCache.getOne<any>(guild.id, user.id);
		const oldVal = memSettings[key];
		embed.title = `${user.username}#${user.discriminator} - ${key}`;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal) {
				embed.description = t('cmd.inviteCodeConfig.current.text', {
					prefix,
					key
				});

				if (info.clearable) {
					embed.description +=
						'\n' +
						t('cmd.inviteCodeConfig.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.inviteCodeConfig.current.title'),
					value: this.settings.beautify(info.type, oldVal)
				});
			} else {
				embed.description = t('cmd.memberConfig.current.notSet', {
					prefix,
					key
				});
			}
			return this.sendReply(message, embed);
		}

		if (value === null) {
			if (!info.clearable) {
				await this.sendReply(message, t('cmd.memberConfig.canNotClear', { prefix, key }));
			}
		} else if ((value !== null || value !== undefined) && info.validate) {
			// Only validate the config setting if we're not resetting or clearing it
			const error = info.validate(key, value, context);

			if (error) {
				return this.sendReply(message, error);
			}
		}

		// Set new value (we override the local value, because the formatting probably changed)
		// If the value didn't change, then it will now be equal to oldVal (and also have the same formatting)
		value = await this.memberSettingsCache.setOne(guild.id, user.id, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.memberConfig.sameValue');
			embed.fields.push({
				name: t('cmd.memberConfig.current.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.memberConfig.changed.text', { prefix, key });

		// Log the settings change
		await this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null) {
			embed.fields.push({
				name: t('cmd.memberConfig.previous.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.memberConfig.new.title'),
			value: value !== null ? this.settings.beautify(info.type, value) : t('cmd.memberConfig.none')
		});

		await this.sendReply(message, embed);
	}
}
