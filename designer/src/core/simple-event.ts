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

	public readonly forward = (value: T) => {
		if (this.listeners.length > 0) {
			this.listeners.forEach(listener => listener(value));
		}
	};

	public count(): number {
		return this.listeners.length;
	}

	public first(): Promise<T> {
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
