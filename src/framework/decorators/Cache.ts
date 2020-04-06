import 'reflect-metadata';

export const cacheInjections: Map<any, Map<string, any>> = new Map();

// tslint:disable-next-line: variable-name
export const Cache = (explicitType?: () => any) => {
	return <T>(target: T, key: string) => {
		let classMap = cacheInjections.get(target.constructor);
		if (!classMap) {
			classMap = new Map();
			cacheInjections.set(target.constructor, classMap);
		}

		const implicitType = Reflect.getMetadata('design:type', target, key);
		if (!implicitType && !explicitType) {
			throw new Error(`${target.constructor.name}:${key} needs to have an explicitly defined type`);
		}
		const type = explicitType || (() => implicitType);

		classMap.set(key, type);
	};
};
