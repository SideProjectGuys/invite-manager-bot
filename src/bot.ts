import { configureScope, init } from '@sentry/node';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { IMClient } from './client';
import { Channel } from './models/Channel';
import { CommandUsage } from './models/CommandUsage';
import { CustomInvite } from './models/CustomInvite';
import { Guild } from './models/Guild';
import { InviteCode } from './models/InviteCode';
import { InviteCodeSetting } from './models/InviteCodeSetting';
import { Join } from './models/Join';
import { Leave } from './models/Leave';
import { Log } from './models/Log';
import { Member } from './models/Member';
import { MemberSetting } from './models/MemberSetting';
import { PremiumSubscription } from './models/PremiumSubscription';
import { Punishment } from './models/Punishment';
import { PunishmentConfig } from './models/PunishmentConfig';
import { Rank } from './models/Rank';
import { Role } from './models/Role';
import { RolePermission } from './models/RolePermission';
import { ScheduledAction } from './models/ScheduledAction';
import { Setting } from './models/Setting';
import { Strike } from './models/Strike';
import { StrikeConfig } from './models/StrikeConfig';

const pkg = require('../package.json');
const config = require('../config.json');

// First two arguments are "node" and "<filename>"
if (process.argv.length < 5) {
	console.error('-------------------------------------');
	console.error('Syntax: bot.js <token> <shardId> <shardCount> (<instance>)');
	console.error('-------------------------------------');
	process.exit(1);
}
const rawParams = process.argv.slice(2);
const args = rawParams.filter(a => !a.startsWith('--'));
const flags = rawParams.filter(f => f.startsWith('--'));

const type = config.bot.type;
const token = args[0];
const shardId = Number(args[1]);
const shardCount = Number(args[2]);
const instance = args[3] || type;

// Initialize sentry
init({
	dsn: config.sentryDsn,
	release: pkg.version,
	environment: process.env.NODE_ENV || 'production'
});
configureScope(scope => {
	scope.setTag('botType', type);
	scope.setTag('instance', instance);
	scope.setTag('shard', `${shardId}/${shardCount}`);
});

process.on('unhandledRejection', (reason: any, p: any) => {
	console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

console.log('-------------------------------------');
console.log('Syncing database...');
console.log('-------------------------------------');
createConnection({
	...config.database,
	entities: [
		Channel,
		CommandUsage,
		CustomInvite,
		Guild,
		InviteCode,
		InviteCodeSetting,
		Join,
		Leave,
		Log,
		Member,
		MemberSetting,
		PremiumSubscription,
		Punishment,
		PunishmentConfig,
		Rank,
		Role,
		RolePermission,
		ScheduledAction,
		Setting,
		Strike,
		StrikeConfig
	]
})
	.then(async () => {
		console.log('-------------------------------------');
		console.log(`This is shard ${shardId}/${shardCount} of ${type} instance ${instance}`);
		console.log('-------------------------------------');
		const client = new IMClient({
			version: pkg.version,
			token,
			type,
			instance,
			shardId,
			shardCount,
			flags,
			config
		});

		console.log('-------------------------------------');
		console.log('Starting bot...');
		console.log('-------------------------------------');
		await client.connect();
	})
	.catch(err => console.error(err));
