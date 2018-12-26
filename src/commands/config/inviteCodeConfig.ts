import { Embed, Invite, Message } from 'eris';

import { IMClient } from '../../client';
import {
	EnumResolver,
	InviteCodeResolver,
	SettingsValueResolver
} from '../../resolvers';
import { InviteCodeSettingsKey, LogAction } from '../../sequelize';
import { beautify, canClear, inviteCodeSettingsInfo } from '../../settings';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.inviteCodeConfig,
			aliases: ['invite-code-config', 'icc'],
			args: [
				{
					name: 'key',
					resolver: new EnumResolver(
						client,
						Object.values(InviteCodeSettingsKey)
					)
				},
				{
					name: 'inviteCode',
					resolver: InviteCodeResolver
				},
				{
					name: 'value',
					resolver: new SettingsValueResolver(client, inviteCodeSettingsInfo),
					rest: true
				}
			],
			group: CommandGroup.Config,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[key, inv, value]: [InviteCodeSettingsKey, Invite, any],
		flags: {},
		context: Context
	): Promise<any> {
		const { guild, settings, t } = context;
		const prefix = settings.prefix;
		const embed = this.client.createEmbed();

		if (!key) {
			embed.title = t('cmd.inviteCodeConfig.title');
			embed.description = t('cmd.inviteCodeConfig.text', { prefix });

			const keys = Object.keys(InviteCodeSettingsKey);
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.keys.title'),
				value: keys.join('\n')
			});

			return this.client.sendReply(message, embed);
		}

		if (!inv) {
			const allSets = await this.client.cache.inviteCodes.getByGuild(guild.id);
			if (allSets.size > 0) {
				allSets.forEach((set, invCode) =>
					embed.fields.push({
						name: invCode,
						value: beautify(key, set[key])
					})
				);
			} else {
				embed.description = t('cmd.inviteCodeConfig.noneSet');
			}
			return this.client.sendReply(message, embed);
		}

		// Check if this is actually a real invite code
		if (inv.guild.id !== guild.id) {
			return this.client.sendReply(
				message,
				t('cmd.inviteCodeConfig.codeForOtherGuild')
			);
		}

		const codeSettings = await this.client.cache.inviteCodes.get(inv.code);
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

				if (canClear(key)) {
					embed.description +=
						'\n' +
						t('cmd.inviteCodeConfig.current.clear', {
							prefix,
							key
						});
				}

				embed.fields.push({
					name: t('cmd.inviteCodeConfig.current.title'),
					value: beautify(key, oldVal)
				});
			} else {
				embed.description = t('cmd.inviteCodeConfig.current.notSet', {
					prefix,
					key
				});
			}
			return this.client.sendReply(message, embed);
		}

		// If the value is null we want to clear it. Check if that's allowed.
		if (value === null) {
			if (!canClear(key)) {
				return this.client.sendReply(
					message,
					t('cmd.inviteCodeConfig.canNotClear', { prefix, key })
				);
			}
		} else {
			// Only validate the config setting if we're not resetting or clearing it
			const error = this.validate(key, value, context);
			if (error) {
				return this.client.sendReply(message, error);
			}
		}

		// Set new value (we override the local value, because the formatting probably changed)
		// If the value didn't change, then it will now be equal to oldVal (and also have the same formatting)
		value = await this.client.cache.inviteCodes.setOne(inv.code, key, value);

		if (value === oldVal) {
			embed.description = t('cmd.inviteCodeConfig.sameValue');
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.current.title'),
				value: beautify(key, oldVal)
			});
			return this.client.sendReply(message, embed);
		}

		embed.description = t('cmd.inviteCodeConfig.changed.text', { prefix, key });

		// Log the settings change
		this.client.logAction(guild, message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal !== null) {
			embed.fields.push({
				name: t('cmd.inviteCodeConfig.previous.title'),
				value: beautify(key, oldVal)
			});
		}

		embed.fields.push({
			name: t('cmd.inviteCodeConfig.new.title'),
			value:
				value !== null ? beautify(key, value) : t('cmd.inviteCodeConfig.none')
		});

		// Do any post processing, such as example messages
		const cb = await this.after(message, embed, key, value, context);

		await this.client.sendReply(message, embed);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		key: InviteCodeSettingsKey,
		value: any,
		{ t, me }: Context
	): string | null {
		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		message: Message,
		embed: Embed,
		key: InviteCodeSettingsKey,
		value: any,
		context: Context
	): Promise<Function> {
		return null;
	}
}
