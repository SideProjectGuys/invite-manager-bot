const { spawn } = require('child_process');

const config = require('../config.json');

let child = spawn(
	/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
	['run', 'build'],
	{
		stdio: 'inherit'
	}
);

child.on('error', error => console.log(error));

child.on('close', () => {
	child = spawn(
		'node',
		['--inspect', './bin/bot.js', '--no-rabbitmq', config.devToken, '1', '1'],
		{
			stdio: 'inherit'
		}
	);
	child.on('error', error => console.log(error));
});
