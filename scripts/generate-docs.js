const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const locales = [
	'en',

	'ar',
	'bg',
	'cs',
	'de',
	'el',
	'es',
	'fr',
	'hu',
	'id_ID',
	'it',
	'ja',
	'lt',
	'nl',
	'pl',
	'pt',
	'pt_BR',
	'ro',
	'ru',
	'sr',
	'tr',
	'zh_CN',
	'zh_TW'
];

const argTypes = [
	'boolean',
	'number',
	'enum',
	'invitecode',
	'user',
	'role',
	'channel',
	'command',
	'string',
	'date',
	'duration'
];

const langRegex = /§{lang}/g;
const varRegex = /§{([\w\.]+)(?::\[(.*?)\])?}/g;

function geti18n(config) {
	delete require.cache['i18n'];
	i18n = require('i18n');
	i18n.configure(config);
}

let child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'build'], {
	stdio: 'inherit'
});

child.on('error', error => console.log(error));

child.on('close', () => {
	const cmds = [];
	const cmdDirs = [
		path.resolve('./bin/framework/commands'),
		path.resolve('./bin//invites/commands'),
		path.resolve('./bin/moderation/commands'),
		path.resolve('./bin/music/commands')
	];
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
			const file = path.join(dir, fileName);

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
				const parent = Object.getPrototypeOf(constr);
				if (!parent || parent.name !== 'Command') {
					return;
				}

				const inst = new constr(fakeClient);
				cmds.push(inst);
			}
		});

	for (const dir of cmdDirs) {
		loadRecursive(dir);
	}

	console.log(`Loaded \x1b[32m${cmds.length}\x1b[0m commands!`);

	const getAllFiles = dir => {
		let files = [];
		fs.readdirSync(dir).forEach(fileName => {
			const file = path.join(dir, fileName);

			if (fs.statSync(file).isDirectory()) {
				files = files.concat(getAllFiles(file));
				return;
			}

			files.push(file);
		});
		return files;
	};

	console.log('Generating reference...');

	let i18nBot = {};
	geti18n({
		locales,
		directory: path.resolve('./i18n/bot/'),
		objectNotation: true,
		register: i18nBot,
		updateFiles: true
	});

	locales.forEach(locale => {
		const niceLocale = locale.replace('_', '-');
		console.log(`  ${niceLocale}`);

		if (!fs.existsSync(`./docs/${niceLocale}`)) {
			fs.mkdirSync(`./docs/${niceLocale}`);
		}

		const _tBot = (phrase, replacements) => i18nBot.__({ locale, phrase }, replacements);

		if (!fs.existsSync(`./docs/${niceLocale}/reference/`)) {
			fs.mkdirSync(`./docs/${niceLocale}/reference/`);
		}

		function generateGroup(path, group) {
			let out = '';
			if (path.length > 0) {
				const prefix = '#'.repeat(path.length + 2);
				out += `${prefix} ${_tBot(`settings.groups.${path.join('.')}.title`)}\n\n`;
				if (group.__settings) {
					out += `| Setting | Description |\n|---|---|\n`;
					out += group.__settings
						.map(
							key =>
								`| [${_tBot(`settings.${key}.title`)}](#${key.toLowerCase()}) | ${_tBot(`settings.${key}.description`)}`
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

		function generateExamples(cmd) {
			const examples = [];
			if (!cmd.args.some(a => a.required)) {
				examples.push('```text\n' + `!${cmd.name}` + '\n```\n');
			}
			return examples.concat(cmd.extraExamples.map(e => '```text\n' + e + '\n```\n'));
		}

		// Import after compile
		const { guildSettingsInfo } = require('../bin/settings.js');
		const { CommandGroup } = require('../bin/types');

		// Generate config docs
		const settings = {};
		Object.keys(guildSettingsInfo).forEach(key => {
			const info = guildSettingsInfo[key];
			let text = `---\n## ${_tBot(`settings.${key}.title`)}\n\n`;
			text += `${_tBot(`settings.${key}.description`)}\n\n`;
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
					text += `Possible values: ${info.possibleValues.map(v => `\`${v}\``).join(', ')}\n\n`;
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

		outSettings += Object.keys(guildSettingsInfo)
			.map(key => `<a name=${key}></a>\n\n` + guildSettingsInfo[key].markdown)
			.join('\n\n');

		fs.writeFileSync(`./docs/${niceLocale}/reference/settings.md`, outSettings);

		// Generate command docs
		let outCmds = '# Commands\n\n';
		outCmds += 'To get a list of available commands, do !help on your server.\n\n';

		outCmds +=
			'## Arguments & Flags\n\nMost commands accept arguments and/or flags.  \n' +
			'According to the **Type** of the argument or flag you can provide different values.\n\n';

		argTypes.forEach(argType => {
			const name = _tBot(`resolvers.${argType}.type`);
			const info = _tBot(`resolvers.${argType}.typeInfo`);
			outCmds += `### ${name}\n\n${info}\n\n`;
		});

		outCmds += '## Overview\n\n';
		Object.keys(CommandGroup).forEach(group => {
			const groupCmds = cmds.filter(c => c.group === group).sort((a, b) => a.name.localeCompare(b.name));
			if (groupCmds.length === 0) {
				return;
			}

			outCmds += `### ${group}\n\n| Command | Description | Usage |\n|---|---|---|\n`;
			outCmds += groupCmds
				.map(
					cmd =>
						`| [${cmd.name}](#${cmd.name}) ` +
						`| ${_tBot(`cmd.${cmd.name}.self.description`)} | ` +
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
				const info = cmd.getInfo2({ t: _tBot });

				outCmds += `<a name='${cmd.name}'></a>\n\n---\n\n## !${cmd.name}\n\n`;

				if (cmd.name.startsWith('legacy')) {
					outCmds +=
						'> [!WARNING|style:flat]\n' +
						'> This command has been deprecated and will be removed soon, please avoid using it.\n\n';
				}

				outCmds += `${_tBot(`cmd.${cmd.name}.self.description`)}\n\n`;
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

		fs.writeFileSync(`./docs/${niceLocale}/reference/commands.md`, outCmds);
	});

	console.log('Generating docs...');

	let i18nDocs = {};
	geti18n({
		locales,
		directory: path.resolve('./i18n/docs/'),
		objectNotation: true,
		register: i18nDocs,
		updateFiles: true
	});

	locales.forEach(locale => {
		const niceLocale = locale.replace('_', '-');
		console.log(`  ${niceLocale}`);

		const _tDocs = (phrase, replacements) => i18nDocs.__({ locale, phrase }, replacements);

		const docFiles = getAllFiles(`./docs/_base/`);
		docFiles.forEach(docFile => {
			const newPath = path.relative('./docs/_base/', docFile).replace(/\.md/gi, '');

			let text = fs.readFileSync(docFile, 'utf8');
			text = text.replace(langRegex, niceLocale);
			text = text.replace(varRegex, (s, ...args) => {
				let replace = {};
				if (args[1]) {
					replace = JSON.parse(`{${args[1]}}`);
					Object.keys(replace).forEach(key => {
						replace[key] = replace[key].replace(varRegex, (s, ...args) => _tDocs(args[0]));
					});
				}
				return _tDocs(args[0], replace);
			});

			fs.mkdirpSync(`./docs/${niceLocale}/${path.dirname(newPath)}`);
			fs.writeFileSync(`./docs/${niceLocale}/${newPath}.md`, text, 'utf8');
		});
	});

	// Generate the main readme and sidebar with all the languages
	let sidebarText = '';
	locales.forEach(locale => {
		const langName = i18nBot.__({ locale, phrase: 'lang' });
		sidebarText += `- [${langName}](/${locale.replace('_', '-')}/README.md)\n`;
	});
	fs.writeFileSync(`./docs/_sidebar.md`, sidebarText);

	let readmeText = '# InviteManager Docs\n\n';
	locales.forEach(locale => {
		const langName = i18nBot.__({ locale, phrase: 'lang' });
		readmeText += `- [${langName}](/${locale.replace('_', '-')}/README.md)\n`;
	});
	fs.writeFileSync(`./docs/README.md`, readmeText);
});
