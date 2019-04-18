const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const i18n = require('i18n');

i18n.configure({
	locales: [
		'en',
		'de',
		'el',
		'en',
		'es',
		'fr',
		'it',
		'lt',
		'nl',
		'pt',
		'ro',
		'sr'
	],
	defaultLocale: 'en',
	directory: __dirname + '/../locale',
	objectNotation: true
});

const t = (key, replacements) =>
	i18n.__({ locale: 'en', phrase: key }, replacements);

function generateText(key, obj) {
	let text = `## ${t(`settings.${key}.title`)}\n\n`;
	text += `${t(`settings.${key}.description`)}\n\n`;
	text += `Type: \`${obj.type}\`\n\n`;
	text += `Default: \`${obj.defaultValue}\`\n\n`;
	text += `Reset to default:\n\`!config ${key} default\`\n\n`;
	if (obj.type === 'Boolean') {
		text += `Enable:\n\n`;
		text += `\`!config ${key} true\`\n\n`;
		text += `Disable:\n\n`;
		text += `\`!config ${key} false\`\n\n`;
	} else {
		if (obj.possibleValues) {
			text += `Possible values: ${obj.possibleValues
				.map(v => `\`${v}\``)
				.join(', ')}\n\n`;
			text += `Example:\n\n`;
			text += `\`!config ${key} ${obj.possibleValues[0]}\`\n\n`;
		}
		if (obj.exampleValues) {
			text += `Examples:\n\n`;
			obj.exampleValues.forEach(ex => {
				text += `\`!config ${key} ${ex}\`\n\n`;
			});
		}
	}
	if (obj.premiumInfo) {
		text += `{% hint style="info" %} ${obj.premiumInfo} {% endhint %}`;
	}

	return text;
}

function generateGroup(path, group) {
	let out = '';
	if (path.length > 0) {
		const prefix = '#'.repeat(path.length + 2);
		out += `${prefix} ${t(`settings.groups.${path.join('.')}.title`)}\n\n`;
		if (group.__settings) {
			out += `| Setting | Description |\n|---|---|\n`;
			out += group.__settings
				.map(
					key =>
						`| [${t(`settings.${key}.title`)}](#${key.toLowerCase()}) | ${t(
							`settings.${key}.description`
						)}`
				)
				.join('\n');
		}
		out += `\n\n`;
	}
	Object.keys(group).forEach(subGroup => {
		if (subGroup === '__settings') {
			return;
		}
		out += generateGroup(path.concat(subGroup), group[subGroup]);
	});
	return out;
}

let child = spawn(
	/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
	['run', 'build'],
	{
		stdio: 'inherit'
	}
);

child.on('error', error => console.log(error));

child.on('close', () => {
	// Import after compile
	const { settingsInfo } = require('../bin/settings.js');
	const { CommandGroup } = require('../bin/types');

	// Generate config docs
	const settings = {};
	Object.keys(settingsInfo).forEach(key => {
		const info = settingsInfo[key];
		info.markdown = generateText(key, info);

		let curr = settings;
		info.grouping.forEach(grp => {
			let next = curr[grp];
			if (!next) {
				next = {};
				curr[grp] = next;
			}
			curr = next;
		});

		if (!curr.__settings) {
			curr.__settings = [];
		}
		curr.__settings.push(key);
	});

	let outSettings = '# Configs\n\n';
	outSettings +=
		'There are many config options that can be set. ' +
		`You don't have to set all of them. If you just added the bot, just run ` +
		'`!setup`, which will guide you through the most important ones.\n\n';

	outSettings += '## Overview\n\n';
	outSettings += generateGroup([], settings);

	outSettings += Object.keys(settingsInfo)
		.map(key => `<a name=${key}></a>\n\n` + settingsInfo[key].markdown)
		.join('\n\n');

	fs.writeFileSync('./docs/Settings.md', outSettings);

	// Generate command docs
	const cmds = [];
	const cmdDir = path.resolve(__dirname, '../bin/commands/');
	const loadRecursive = dir =>
		fs.readdirSync(dir).forEach(fileName => {
			const file = dir + '/' + fileName;

			if (fs.statSync(file).isDirectory()) {
				loadRecursive(file);
				return;
			}

			if (!fileName.endsWith('.js')) {
				return;
			}

			const clazz = require(file);
			if (clazz.default) {
				const constr = clazz.default;
				const inst = new constr({
					msg: {
						createEmbed: () => {},
						sendReply: () => {},
						sendEmbed: () => {},
						showPaginated: () => {}
					}
				});
				cmds.push(inst);
			}
		});
	loadRecursive(cmdDir);
	console.log(`Loaded \x1b[32m${cmds.length}\x1b[0m commands!`);

	let outCmds = '# Commands\n\n';
	outCmds +=
		'To get a list of available commands, do !help on your server.\n\n';

	outCmds += '## Overview\n\n';
	Object.keys(CommandGroup).forEach(group => {
		const groupCmds = cmds
			.filter(c => c.group === group)
			.sort((a, b) => a.name.localeCompare(b.name));
		if (groupCmds.length === 0) {
			return;
		}

		outCmds += `### ${group}\n\n| Command | Description | Usage |\n|---|---|---|\n`;
		outCmds += groupCmds
			.map(
				cmd =>
					`| [${cmd.name}](#${cmd.name}) | ${t(
						`cmd.${cmd.name}.self.description`
					)} | ${cmd.usage
						.replace('{prefix}', '!')
						.replace(/</g, '\\<')
						.replace(/>/g, '\\>')}`
			)
			.join('\n');
		outCmds += '\n\n';
	});

	cmds
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach(cmd => {
			const usage = cmd.usage
				.replace('{prefix}', '!')
				.replace(/</g, '\\<')
				.replace(/>/g, '\\>');
			const info = cmd
				.getInfo({ t })
				.replace(/</g, '\\<')
				.replace(/>/g, '\\>');

			outCmds +=
				`<a name='${cmd.name}'></a>\n` +
				`## ${t(`cmd.${cmd.name}.self.title`)}\n\n`;
			outCmds += `${t(`cmd.${cmd.name}.self.description`)}\n\n`;
			outCmds += `### Usage\n\n${usage}\n\n### Arguments\n\n${info}\n\n`;
		});

	fs.writeFileSync('./docs/Commands.md', outCmds);
});
