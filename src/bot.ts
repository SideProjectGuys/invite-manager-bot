import * as amqplib from 'amqplib';
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
	console.error('Syntax: bot.js <token> <shardId> <shardCount> (<prefix>)');
	console.error('-------------------------------------');
	process.exit(1);
}
const token = process.argv[2];
const shardId = parseInt(process.argv[3], 10);
const shardCount = parseInt(process.argv[4], 10);
const _prefix = process.argv[5];

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
}).then(() => {
	console.log('-------------------------------------');
	console.log('Connecting to RabbitMQ...');
	console.log('-------------------------------------');
	amqplib.connect(config.rabbitmq).then(async rabbitMqConn => {
		console.log('-------------------------------------');
		console.log(`This is shard ${shardId}/${shardCount}`);
		console.log('-------------------------------------');
		const client = new IMClient(
			pkg.version,
			rabbitMqConn,
			token,
			shardId,
			shardCount,
			_prefix
		);

		console.log('-------------------------------------');
		console.log('Starting bot...');
		console.log('-------------------------------------');
		client.connect();
	});
});
