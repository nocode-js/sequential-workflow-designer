export class ObjectCloner {
	public static deepClone<T>(instance: T): T {
		if (typeof window.structuredClone !== 'undefined') {
			return window.structuredClone(instance);
		}
		return JSON.parse(JSON.stringify(instance));
	}
}
