const { spawn } = require('child_process');

const config = require('../config.json');

let child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'build'], {
	stdio: 'inherit'
});

const debug = process.argv[2] || false;

child.on('error', error => console.log(error));

child.on('close', () => {
	if (debug) {
		console.log('STARTING AND WAITING FOR DEBUGGER');
	}

	child = spawn(
		'node',
		[`--inspect${debug ? '-brk' : ''}=19229`, './bin/bot.js', '--no-rabbitmq', config.devToken, '1', '1'],
		{
			stdio: 'inherit'
		}
	);
	child.on('error', error => console.log(error));
});
