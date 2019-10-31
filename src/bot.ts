import { configureScope, init } from '@sentry/node';

import { IMClient } from './client';

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

const main = async () => {
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
};

main().catch(err => console.error(err));
