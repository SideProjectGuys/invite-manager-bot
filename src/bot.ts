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
const rawArgs = process.argv.slice(2);
const args = rawArgs.filter(a => !a.startsWith('--'));

const token = args[0];
const shardId = Number(args[1]);
const shardCount = Number(args[2]);
const _prefix = args[3];

// Initialize sentry
init({ dsn: config.sentryDsn, release: pkg.version });
configureScope(scope => {
	scope.setTag('botType', config.bot.type);
	scope.setTag('shard', `${shardId}`);
	if (_prefix) {
		scope.setTag('prefix', _prefix);
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
	const client = new IMClient(pkg.version, token, shardId, shardCount, _prefix);

	console.log('-------------------------------------');
	console.log('Starting bot...');
	console.log('-------------------------------------');
	client.connect();
});
