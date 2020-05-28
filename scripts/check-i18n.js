const { readFileSync, readdirSync, statSync } = require('fs');
const { resolve, relative } = require('path');
const chalk = require('chalk');

const en = require('../i18n/bot/en.json');

const REGEX = /(?:\W(?:t)\(|phrase:)\s*['`"](.+?)['`"]/gi;

const found = [];
const variablePrefixes = [];

function readDir(dir) {
	const fileNames = readdirSync(dir);
	for (const fileName of fileNames) {
		const file = dir + '/' + fileName;

		if (statSync(file).isDirectory()) {
			readDir(file);
			continue;
		}

		if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
			continue;
		}

		const text = readFileSync(file, 'utf8');
		const fileFound = [];

		let matches;
		while ((matches = REGEX.exec(text))) {
			fileFound.push(matches[1]);
		}

		found.push([relative(resolve(__dirname, '../'), file), fileFound]);
	}
}

function flattenLang(lang, prefix) {
	let arr = [];
	for (const key of Object.keys(lang)) {
		const value = lang[key];
		const subKey = `${prefix ? prefix + '.' : ''}${key}`;

		if (typeof value === 'string') {
			arr.push(subKey);
		} else {
			arr = arr.concat(flattenLang(value, subKey));
		}
	}
	return arr;
}

function checkLang(lang, key) {
	const parts = key.split('.');
	let obj = lang;
	if (typeof obj === 'undefined') {
		return false;
	}

	for (let i = 0; i < parts.length; i++) {
		obj = obj[parts[i]];
		if (typeof obj === 'undefined') {
			return false;
		}
	}
	return true;
}

console.log(chalk.blue('Checking that all used keys are translated...'));

readDir(resolve(__dirname, '../src'));

for (const [file, matches] of found) {
	for (const match of matches) {
		let variableIndex = match.indexOf('$');
		if (variableIndex >= 0) {
			variablePrefixes.push(match.substr(0, variableIndex));
			console.log(chalk.yellow(`⚠️ ${chalk.blue(file)}: Variable found in ${chalk.blue(match)} - skipping checks`));
			continue;
		}

		const enOk = checkLang(en, match);
		if (!enOk) {
			console.error(chalk.red(`✗ ${chalk.blue(match)} (EN) from ${chalk.blue(file)}`));
		}
	}

	console.log(chalk.green(`✓ ${file}`));
}

console.log(chalk.blue('Checking that all translated keys are used...'));

const keys = []
	.concat(flattenLang(en).map((key) => ['EN', key]))
	.filter(([, key], i, arr) => arr.findIndex(([, key2]) => key2 === key) === i);

for (const [lang, key] of keys) {
	if (!found.some(([, matches]) => matches.includes(key))) {
		if (variablePrefixes.some((prefix) => key.startsWith(prefix))) {
			console.log(chalk.yellow(`⚠️ ${chalk.blue(key)}: Key starts with a variable prefix - skipping checks`));
			continue;
		}

		console.error(chalk.red(`✗ ${chalk.blue(key)} (${lang}) not used in any file`));
	}

	console.log(chalk.green(`✓ ${key}`));
}
