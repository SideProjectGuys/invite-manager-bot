import { IMCommand } from '../../framework/commands/Command';
import { Service } from '../../framework/decorators/Service';
import { MusicService } from '../services/Music';

export { CommandContext } from '../../framework/commands/Command';

export abstract class IMMusicCommand extends IMCommand {
	@Service() protected music: MusicService;
}
