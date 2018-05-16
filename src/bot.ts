import { IMClient } from './client';
import { sequelize } from './sequelize';

// First two arguments are "node" and "<filename>"
if (process.argv.length < 4) {
	console.error('-------------------------------------');
	console.error('Syntax: bot.js <shardId> <shardCount>');
	console.error('-------------------------------------');
	process.exit(1);
}
const shardId = parseInt(process.argv[2], 10);
const shardCount = parseInt(process.argv[3], 10);

const pkg = require('../package.json');

process.on('unhandledRejection', (reason: any, p: any) => {
	console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

console.log('-------------------------------------');
console.log(`This is shard ${shardId}/${shardCount}`);
console.log('-------------------------------------');
const client = new IMClient(pkg.version, shardId, shardCount);

console.log('-------------------------------------');
console.log('Syncing database...');
console.log('-------------------------------------');
sequelize.sync().then(() => {
	console.log('-------------------------------------');
	console.log('Starting bot...');
	console.log('-------------------------------------');
	client.start();
});
