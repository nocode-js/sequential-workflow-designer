export class SimpleEvent<T> {
	private readonly listeners: SimpleEventListener<T>[] = [];

	public subscribe(listener: SimpleEventListener<T>) {
		this.listeners.push(listener);
	}

	public unsubscribe(listener: SimpleEventListener<T>) {
		const index = this.listeners.indexOf(listener);
		if (index >= 0) {
			this.listeners.splice(index, 1);
		} else {
			throw new Error('Unknown listener');
		}
	}

	public readonly emit = (value: T) => {
		for (const listener of this.listeners) {
			listener(value);
		}
	};

	/**
	 * @deprecated Use `emit` method instead.
	 */
	public readonly forward = this.emit;

	public count(): number {
		return this.listeners.length;
	}

	public once(): Promise<T> {
		return new Promise(resolve => {
			const handler = (value: T) => {
				this.unsubscribe(handler);
				resolve(value);
			};
			this.subscribe(handler);
		});
	}
}

export type SimpleEventListener<T> = (value: T) => void;
