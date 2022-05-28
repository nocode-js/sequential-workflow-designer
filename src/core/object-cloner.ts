
export class ObjectCloner {

	public static deepClone<T>(instance: T): T {
		return structuredClone(instance);
	}
}
