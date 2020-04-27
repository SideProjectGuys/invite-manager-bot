import { Message } from 'eris';

import { Service } from '../../decorators/Service';
import { IMModule } from '../../Module';
import { EnumResolver } from '../../resolvers';
import { PremiumService } from '../../services/Premium';
import { CommandContext, IMCommand } from '../Command';

enum PremiumType {
	Patreon = 'Patreon'
}

export default class extends IMCommand {
	@Service() private premium: PremiumService;

	public constructor(module: IMModule) {
		super(module, {
			name: 'check-premium',
			aliases: ['cp'],
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(module.client, Object.values(PremiumType)),
					required: true
				}
			],
			group: 'Premium',
			guildOnly: false,
			defaultAdminOnly: false
		});
	}

	public async action(
		message: Message,
		[type]: [PremiumType],
		flags: {},
		{ t, settings }: CommandContext
	): Promise<any> {
		const prefix = settings ? settings.prefix : '!';
		const lang = settings ? settings.lang : 'en';
		const memberId = message.author.id;

		const embed = this.createEmbed();

		if (type === PremiumType.Patreon) {
			embed.title = t('cmd.premium.check.title');

			const res = await this.premium.checkPatreon(memberId);

			if (res === 'not_found') {
				embed.description = t('cmd.premium.check.notFound');
			} else if (res === 'declined') {
				embed.description = t('cmd.premium.check.declined');
			} else if (res === 'paused') {
				embed.description = t('cmd.premium.check.paused');
			} else {
				embed.description = t('cmd.premium.check.done', {
					valid: res.locale(lang).calendar(),
					cmd: '`' + prefix + 'premium`'
				});
			}
		}

		return this.sendReply(message, embed);
	}
}
