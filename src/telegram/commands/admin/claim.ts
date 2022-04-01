import { Composer } from 'telegraf';
import { userFlags } from '../../../constants/userFlags.js';
import { setUserFlags } from '../../../data/data.js';
import utils from '../../utils/utils.js';

export const claimCommand = Composer.command("claim", (ctx) => {
		if (utils.isCreator(ctx.from.id)) {
			setUserFlags(ctx.from.id,
				userFlags.admin.debug,
				userFlags.admin.registerGroup,
				userFlags.admin.restart)
		}
	});