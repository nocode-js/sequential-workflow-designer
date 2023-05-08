import { Behavior } from '../behavior';

export interface PressingBehaviorHandler {
	handle(): void;
}

export class PressingBehavior implements Behavior {
	public static create(clickedElement: Element, handler: PressingBehaviorHandler): PressingBehavior {
		return new PressingBehavior(clickedElement, handler);
	}

	private constructor(private readonly clickedElement: Element, private readonly handler: PressingBehaviorHandler) {}

	public onStart() {
		// Nothing...
	}

	public onMove() {
		// Nothing...
	}

	public onEnd(interrupt: boolean, element: Element | null) {
		if (!interrupt && element && this.clickedElement === element) {
			this.handler.handle();
		}
	}
}
