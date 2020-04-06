import 'reflect-metadata';

export const serviceInjections: Map<any, Map<string, () => any>> = new Map();

// tslint:disable-next-line: variable-name
export const Service = (explicitType?: () => any) => {
	return <T>(target: T, key: string) => {
		let classMap = serviceInjections.get(target.constructor);
		if (!classMap) {
			classMap = new Map();
			serviceInjections.set(target.constructor, classMap);
		}

		const implicitType = Reflect.getMetadata('design:type', target, key);
		if (!implicitType && !explicitType) {
			throw new Error(`${target.constructor.name}:${key} needs to have an explicitly defined type`);
		}
		const type = explicitType || (() => implicitType);

		classMap.set(key, type);
	};
};
