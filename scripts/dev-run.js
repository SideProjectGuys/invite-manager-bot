const {
	spawn
} = require('child_process');

const config = require("../config.json");

let child = spawn('npm', ['run', 'build'], {
	stdio: 'inherit'
});

child.on('close', (code) => {
	child = spawn('node', ['--inspect', './bin/bot.js', config.devToken, '1', '1'], {
		stdio: 'inherit'
	});
});
