import { configureScope, init } from '@sentry/node';
import chalk from 'chalk';

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
const args = rawParams.filter((a) => !a.startsWith('--'));
const flags = rawParams.filter((f) => f.startsWith('--'));

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
configureScope((scope) => {
	scope.setTag('botType', type);
	scope.setTag('instance', instance);
	scope.setTag('shard', `${shardId}/${shardCount}`);
});

process.on('unhandledRejection', (reason: any, p: any) => {
	console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const main = async () => {
	console.log(chalk.green('-------------------------------------'));
	console.log(
		chalk.green(
			`This is shard ${chalk.blue(`${shardId}/${shardCount}`)} of ${chalk.blue(type)} instance ${chalk.blue(instance)}`
		)
	);
	console.log(chalk.green('-------------------------------------'));

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

	console.log(chalk.green('-------------------------------------'));
	console.log(chalk.green('Starting bot...'));
	console.log(chalk.green('-------------------------------------'));

	await client.init();

	console.log(chalk.green('-------------------------------------'));
	console.log(chalk.green('Waiting for start ticket...'));
	console.log(chalk.green('-------------------------------------'));

	await client.waitForStartupTicket();

	console.log(chalk.green('-------------------------------------'));
	console.log(chalk.green('Connecting to discord...'));
	console.log(chalk.green('-------------------------------------'));
	await client.connect();
};

main().catch((err) => console.error(err));
