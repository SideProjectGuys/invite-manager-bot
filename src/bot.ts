import { configureScope, init } from '@sentry/node';
import chalk from 'chalk';

import { IMClient } from './client';

const pkg = require('../package.json');
const config = require('../config.json');

// First two arguments are "node" and "<filename>"
if (process.argv.length < 5) {
	console.error(chalk.red('-------------------------------------'));
	console.error(chalk.red('Syntax: bot.js <token> <firstShard> <lastShard> <shardCount> (<instance>)'));
	console.error(chalk.red('-------------------------------------'));
	process.exit(1);
}
const rawParams = process.argv.slice(2);
const args = rawParams.filter((a) => !a.startsWith('--'));
const flags = rawParams.filter((f) => f.startsWith('--'));

const type = config.bot.type;
const token = args[0];
const firstShard = Number(args[1]);
const lastShard = Number(args[2]);
const shardCount = Number(args[3]);
const instance = args[4] || type;

// Initialize sentry
init({
	dsn: config.sentryDsn,
	release: pkg.version,
	environment: process.env.NODE_ENV || 'production'
});
configureScope((scope) => {
	scope.setTag('botType', type);
	scope.setTag('instance', instance);
	scope.setTag('shardRange', `${firstShard} - ${lastShard}`);
});

process.on('unhandledRejection', (reason: any, p: any) => {
	console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const main = async () => {
	console.log(chalk.white('-------------------------------------'));
	console.log(
		chalk.white(
			`These are shards ${chalk.blue(`${firstShard}`)} to ${chalk.blue(`${lastShard}`)} ` +
				`of ${chalk.blue(`${shardCount}`)} for ${chalk.blue(type)} instance ${chalk.blue(instance)}`
		)
	);
	console.log(chalk.white('-------------------------------------'));

	const client = new IMClient({
		version: pkg.version,
		token,
		type,
		instance,
		firstShard,
		lastShard,
		shardCount,
		flags,
		config
	});

	console.log(chalk.white('-------------------------------------'));
	console.log(chalk.white('Starting bot...'));
	console.log(chalk.white('-------------------------------------'));

	await client.init();

	console.log(chalk.white('-------------------------------------'));
	console.log(chalk.white('Waiting for start ticket...'));
	console.log(chalk.white('-------------------------------------'));

	await client.waitForStartupTicket();

	console.log(chalk.white('-------------------------------------'));
	console.log(chalk.white('Connecting to discord...'));
	console.log(chalk.white('-------------------------------------'));
	await client.connect();
};

main().catch((err) => console.error(err));
