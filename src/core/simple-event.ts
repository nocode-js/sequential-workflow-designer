
export class SimpleEvent<A> {

	private readonly listeners: SimpleEventListener<A>[] = [];

	public subscribe(listener: SimpleEventListener<A>) {
		this.listeners.push(listener);
	}

	public fire(a: A) {
		this.listeners.forEach(listener => listener(a));
	}

	public count(): number {
		return this.listeners.length;
	}
}

export type SimpleEventListener<A> = (a: A) => void;
