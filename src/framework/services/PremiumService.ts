import axios from 'axios';
import moment from 'moment';

import { IMClient } from '../../client';

export class PremiumService {
	private client: IMClient = null;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public async checkPatreon(userId: string) {
		const res = await axios
			.get(`https://api.invitemanager.gg/patreon/check/?userId=${userId}`, {
				auth: this.client.config.bot.apiAuth
			})
			.catch(() => undefined);

		if (!res) {
			return 'not_found';
		} else if (res.data.last_charge_status !== 'Paid') {
			return 'declined';
		} else if (res.data.patron_status !== 'active_patron') {
			return 'paused';
		} else {
			const day = moment(res.data.last_charge_date).date();
			const validUntil = moment()
				.add(1, 'month')
				.date(day)
				.add(1, 'day');
			const amount = res.data.currently_entitled_amount_cents / 100;
			const maxGuilds = 5;

			const subs = await this.client.db.getPremiumSubscriptionsForMember(userId, false);
			const sub = subs.find(s => s.amount === amount && s.maxGuilds === maxGuilds && s.isPatreon === true);

			if (sub) {
				sub.validUntil = validUntil.toDate();
				await this.client.db.savePremiumSubscription(sub);
			} else {
				await this.client.db.savePremiumSubscription({
					memberId: userId,
					validUntil: validUntil.toDate(),
					amount,
					maxGuilds,
					isFreeTier: false,
					isPatreon: true,
					reason: ''
				});
			}

			return validUntil;
		}
	}
}
