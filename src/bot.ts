import { configureScope, init } from '@sentry/node';

import { IMClient } from './client';
import { sequelize } from './sequelize';

const pkg = require('../package.json');
const config = require('../config.json');

// First two arguments are "node" and "<filename>"
if (process.argv.length < 5) {
	console.error('-------------------------------------');
	console.error('Syntax: bot.js <token> <shardId> <shardCount> (<prefix>)');
	console.error('-------------------------------------');
	process.exit(1);
}
const rawParams = process.argv.slice(2);
const args = rawParams.filter(a => !a.startsWith('--'));
const flags = rawParams.filter(f => f.startsWith('--'));

const token = args[0];
const shardId = Number(args[1]);
const shardCount = Number(args[2]);
const customId = args[3];

// Initialize sentry
init({ dsn: config.sentryDsn, release: pkg.version });
configureScope(scope => {
	scope.setTag('botType', config.bot.type);
	scope.setTag('shard', `${shardId}/${shardCount}`);
	if (customId) {
		scope.setTag('customId', customId);
	}
});

process.on('unhandledRejection', (reason: any, p: any) => {
	console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

console.log('-------------------------------------');
console.log('Syncing database...');
console.log('-------------------------------------');
sequelize.sync().then(async () => {
	console.log('-------------------------------------');
	console.log(`This is shard ${shardId}/${shardCount}`);
	console.log('-------------------------------------');
	const client = new IMClient({
		version: pkg.version,
		token,
		shardId,
		shardCount,
		customId,
		flags
	});

	console.log('-------------------------------------');
	console.log('Starting bot...');
	console.log('-------------------------------------');
	client.connect();
});
