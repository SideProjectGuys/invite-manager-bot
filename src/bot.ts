import { IMClient } from './client';
import { sequelize } from './sequelize';

process.on('unhandledRejection', (reason: any, p: any) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const client = new IMClient();

console.log('Syncing database...');
sequelize.sync().then(() => {
	console.log('Starting bot...');
	client.start();
});
