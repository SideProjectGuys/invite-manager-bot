import { Invite, Message } from 'eris';

import { IMClient } from '../../client';
import { CommandContext, IMCommand } from '../../framework/commands/Command';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { InviteCode } from '../../framework/models/InviteCode';
import { LogAction } from '../../framework/models/Log';
import { EnumResolver, InviteCodeResolver, SettingsValueResolver } from '../../framework/resolvers';
import { CommandGroup, SettingsInfo } from '../../types';
import { InviteCodeSettingsCache } from '../cache/InviteCodeSettingsCache';
import { SettingsService } from '../services/Settings';

export default class extends IMCommand {
	@Service() private settings: SettingsService;
	@Cache() private inviteCodeSettingsCache: InviteCodeSettingsCache;

	private settingsInfos: Map<string, SettingsInfo<any>>;

	public constructor(client: IMClient) {
		super(client, {
			name: 'inviteCodeConfig',
			aliases: ['invite-code-config', 'icc'],
			args: [
				{
					name: 'key',
					resolver: null, // setup later
					required: true
				},
				{
					name: 'inviteCode',
					resolver: InviteCodeResolver
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, InviteCode),
					rest: true
				}
			],
			group: CommandGroup.Config,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async init() {
		this.settingsInfos = this.settings.getSettingsInfos(InviteCode);
		this.args[0].resolver = new EnumResolver(this.client, [...this.settingsInfos.keys()]);

		await super.init();
	}

	public async action(
		message: Message,
		[key, inv, value]: [string, Invite, any],
		flags: {},
		context: CommandContext
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = this.createEmbed();

		const info = this.settingsInfos.get(key);

		if (!inv) {
			const allSets = await this.inviteCodeSettingsCache.get<any>(guild.id);
			if (allSets.size > 0) {
				allSets.forEach((set, invCode) =>
					embed.fields.push({
						name: invCode,
						value: this.settings.beautify(info.type, set[key])
					})
				);
			} else {
				embed.description = t('cmd.inviteCodeConfig.noneSet');
			}
			return this.sendReply(message, embed);
		}

		// Check if this is actually a real invite code
		if (inv.guild.id !== guild.id) {
			return this.sendReply(message, t('cmd.inviteCodeConfig.codeForOtherGuild'));
		}

		const codeSettings = await this.inviteCodeSettingsCache.getOne<any>(guild.id, inv.code);
		const oldVal = codeSettings[key];
		embed.title = `${inv.code} - ${key}`;

		if (typeof value === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal !== null) {
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
				embed.description = t('cmd.inviteCodeConfig.current.notSet', {
					prefix,
					key
				});
			}
			return this.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (!info.clearable) {
				return this.sendReply(message, t('cmd.inviteCodeConfig.canNotClear', { prefix, key }));
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
		value = await this.inviteCodeSettingsCache.setOne(guild.id, inv.code, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.inviteCodeConfig.sameValue');
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.current.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
			return this.sendReply(message, embed);
		}

		embed.description = t('cmd.inviteCodeConfig.changed.text', { prefix, key });

		// Log the settings change
		await this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null) {
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.previous.title'),
				value: this.settings.beautify(info.type, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.inviteCodeConfig.new.title'),
			value: value !== null ? this.settings.beautify(info.type, value) : t('cmd.inviteCodeConfig.none')
		});

		await this.sendReply(message, embed);
	}
}
