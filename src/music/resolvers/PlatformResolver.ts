import { CommandContext } from '../../framework/commands/Command';
import { Service } from '../../framework/decorators/Service';
import { Resolver } from '../../framework/resolvers/Resolver';
import { platforms } from '../decorators/Platform';
import { MusicPlatform } from '../models/MusicPlatform';
import { MusicService } from '../services/Music';

export class PlatformResolver extends Resolver {
	@Service() private musicService: MusicService;

	public async resolve(value: string, { t }: CommandContext): Promise<MusicPlatform> {
		if (typeof value === typeof undefined) {
			return;
		}

		const platform = this.musicService.getPlatformByName(value);
		if (platform) {
			return platform;
		}

		throw Error(t(`resolvers.${this.getType()}.invalid`));
	}

	public getHelp({ t }: CommandContext) {
		return t(`resolvers.${this.getType()}.validValues`, {
			values: [...platforms.keys()]
				.sort((a, b) => a.localeCompare(b))
				.map((v) => '`' + v + '`')
				.join(', ')
		});
	}
}
