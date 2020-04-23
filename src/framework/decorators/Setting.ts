import { Client } from 'eris';
import 'reflect-metadata';

import { SettingsInfo } from '../../types';
import { Guild } from '../models/Guild';
import { InviteCode } from '../models/InviteCode';
import { Member } from '../models/Member';

type SettingsBaseClasses = Guild | Member | InviteCode | Client;

type AnyConstructor = new (...args: any[]) => any;
export type SettingsBaseTypeConstructor = new (...args: any[]) => SettingsBaseClasses;

export const settingsBaseClasses: Map<SettingsBaseTypeConstructor, AnyConstructor[]> = new Map();
export const settingsClassesProperties: Map<AnyConstructor, Map<string, SettingsInfo<any>>> = new Map();

// tslint:disable-next-line: variable-name
export const Setting = <T>(info: SettingsInfo<T>) => {
	return (target: any, key: string) => {
		let classMap = settingsClassesProperties.get(target.constructor);
		if (!classMap) {
			classMap = new Map();
			settingsClassesProperties.set(target.constructor, classMap);
		}

		if (classMap.has(key)) {
			throw new Error(`There is already a settings property called ${key} on ${target.constructor}`);
		}

		classMap.set(key, info);
	};
};

// tslint:disable-next-line: variable-name
export const Settings = (baseType: SettingsBaseTypeConstructor) => {
	return (target: AnyConstructor) => {
		let classList = settingsBaseClasses.get(baseType);
		if (!classList) {
			classList = [];
			settingsBaseClasses.set(baseType, classList);
		}

		classList.push(target);
	};
};
