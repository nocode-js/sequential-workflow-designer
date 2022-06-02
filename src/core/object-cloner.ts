
export class ObjectCloner {

	public static deepClone<T>(instance: T): T {
		if (typeof structuredClone !== 'undefined') {
			return structuredClone(instance);
		}
		return JSON.parse(JSON.stringify(instance));
	}
}
