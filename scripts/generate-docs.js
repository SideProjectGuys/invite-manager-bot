const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const i18n = require('i18n');

i18n.configure({
	locales: ['en'],
	defaultLocale: 'en',
	directory: __dirname + '/../locale',
	objectNotation: true
});

const t = (key, replacements) =>
	i18n.__({ locale: 'en', phrase: key }, replacements);

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
		let text = `---\n## ${t(`settings.${key}.title`)}\n\n`;
		text += `${t(`settings.${key}.description`)}\n\n`;
		text += `Type: \`${info.type}\`\n\n`;
		text += `Default: \`${info.defaultValue}\`\n\n`;
		text += `Reset to default:\n\`!config ${key} default\`\n\n`;
		if (info.type === 'Boolean') {
			text += `Enable:\n\n`;
			text += `\`!config ${key} true\`\n\n`;
			text += `Disable:\n\n`;
			text += `\`!config ${key} false\`\n\n`;
		} else {
			if (info.possibleValues) {
				text += `Possible values: ${info.possibleValues
					.map(v => `\`${v}\``)
					.join(', ')}\n\n`;
				text += `Example:\n\n`;
				text += `\`!config ${key} ${info.possibleValues[0]}\`\n\n`;
			}
			if (info.exampleValues) {
				text += `Examples:\n\n`;
				info.exampleValues.forEach(ex => {
					text += `\`!config ${key} ${ex}\`\n\n`;
				});
			}
		}
		if (info.premiumInfo) {
			text += `{% hint style="info" %} ${info.premiumInfo} {% endhint %}`;
		}
		info.markdown = text;

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

	fs.writeFileSync('./docs/getting-started/settings.md', outSettings);

	// Generate command docs
	const cmds = [];
	const cmdDir = path.resolve(__dirname, '../bin/commands/');
	const fakeClient = {
		msg: {
			createEmbed: () => {},
			sendReply: () => {},
			sendEmbed: () => {},
			showPaginated: () => {}
		},
		cmds: {
			commands: cmds
		}
	};
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
				const inst = new constr(fakeClient);
				cmds.push(inst);
			}
		});
	loadRecursive(cmdDir);
	console.log(`Loaded \x1b[32m${cmds.length}\x1b[0m commands!`);

	let outCmds = '# Commands\n\n';
	outCmds +=
		'To get a list of available commands, do !help on your server.\n\n';

	outCmds +=
		'## Arguments & Flags\n\nMost commands accept arguments and/or flags.  \n' +
		'According to the **Type** of the argument or flag you can provide different values.\n\n';

	outCmds += '### Number\n\nThis arguments expects a number\n\n';
	outCmds +=
		'### Text\n\nThis arguments expects any text. You can use quotes (`"Text with quotes"`) for text that has spaces.  \n' +
		`**If the text is the last argument you don't have to use quotes.**\n\n`;

	outCmds +=
		'### Invite Code\n\nThis arguments expects a Discord Invite Code.  \n' +
		'**You can put only the part after `https://discord.gg/` to prevent Discord from creating a preview.**\n\n';

	outCmds +=
		'### Enum\n\nThis arguments expects a value from a specific set of valid values.  \n' +
		'**Depending on the command the valid values can vary. Use `!help <command>` (eg. `!help addRank`) to get more information about the command and the valid values for the enum.**\n\n';

	outCmds +=
		'### User\n\nThis arguments expects a Discord User. You can use any of the following methods to provide a user:\n\n' +
		'- Mention the user: `@Valandur`\n' +
		'- Use their ID: `102785693046026240`\n' +
		'- Use their name: `Valandur`\n' +
		'- Use their name and discriminator: `Valandur#3581`\n' +
		'- Use quotes if their name has a space: `"Valandur with a space"`\n\n';

	outCmds +=
		'### Role\n\nThis arguments expects a Discord Role. You can use any of the following methods to provide a role:\n\n' +
		'- Mention the role: `@Admin`\n' +
		'- Use the ID: `102785693046026240`\n' +
		'- Use the name: `Admin`\n' +
		'- Use quotes if the name has a space: `"Admin with a space"`\n\n';

	outCmds +=
		'### Channel\n\nThis arguments expects a Discord Channel. You can use any of the following methods to provide a channel:\n\n' +
		'- Mention the channel: `#general`\n' +
		'- Use the ID: `409846838129197057`\n' +
		'- Use the name: `general`\n' +
		'- Use quotes if the name has a space: `"general with a space"`\n\n';

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
					`| [${cmd.name}](#${cmd.name}) ` +
					`| ${t(`cmd.${cmd.name}.self.description`)} | ` +
					`${cmd.usage
						.replace('{prefix}', '!')
						.replace(/</g, '\\<')
						.replace(/>/g, '\\>')
						.replace(/\|/g, '\\|')} |`
			)
			.join('\n');
		outCmds += '\n\n';
	});

	cmds
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach(cmd => {
			const usage = cmd.usage.replace('{prefix}', '!');
			const info = cmd.getInfo2({ t });

			outCmds += `<a name='${cmd.name}'></a>\n\n---\n\n## !${cmd.name}\n\n`;

			if (cmd.name.startsWith('legacy')) {
				outCmds +=
					'> [!WARNING|style:flat]\n' +
					'> This command has been deprecated and will be removed soon, please avoid using it.\n\n';
			}

			outCmds += `${t(`cmd.${cmd.name}.self.description`)}\n\n`;
			outCmds += '### Usage\n\n```text\n' + usage + '\n```\n\n';

			if (cmd.aliases.length > 0) {
				outCmds += '### Aliases\n\n';
				outCmds += cmd.aliases.map(a => `- \`!${a}\``).join('\n') + '\n\n';
			}

			if (info.args.length > 0) {
				outCmds += '### Arguments\n\n';
				outCmds += `| Argument | Type | Required | Description | Details |\n|---|---|---|---|---|\n`;
				outCmds += info.args
					.map(
						(arg, i) =>
							`| ${arg.name} ` +
							`| [${arg.type}](#${arg.type.replace(/ /g, '')}) ` +
							`| ${arg.required ? 'Yes' : 'No'} ` +
							`| ${arg.description}` +
							`| ${arg.help || ''} |`
					)
					.join('\n');
				outCmds += '\n\n';
			}

			if (info.flags.length > 0) {
				outCmds += '### Flags\n\n';
				outCmds += `| Flag | Short | Type | Description |\n|---|---|---|---|\n`;
				// &#x2011; is the non-breaking hyphen character
				outCmds += info.flags
					.map(
						flag =>
							`| &#x2011;&#x2011;${flag.name} ` +
							`| ${flag.short ? '&#x2011;' + flag.short : ' '} ` +
							`| [${flag.type}](#${flag.type.replace(/ /g, '')}) ` +
							`| ${flag.description} |`
					)
					.join('\n');
				outCmds += '\n\n';
			}

			outCmds += '### Examples\n\n';
			outCmds += generateExamples(cmd).join('  \n') + '\n\n';
		});

	fs.writeFileSync('./docs/getting-started/commands.md', outCmds);
});

function generateExamples(cmd) {
	const examples = [];
	if (!cmd.args.some(a => a.required)) {
		examples.push('```text\n' + `!${cmd.name}` + '\n```\n');
	}
	return examples.concat(
		cmd.extraExamples.map(e => '```text\n' + e + '\n```\n')
	);
}
