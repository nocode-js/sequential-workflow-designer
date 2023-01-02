import { Vector } from '../core/vector';

export interface Behavior {
	onStart(position: Vector): void;
	onMove(delta: Vector): Behavior | void;
	onEnd(interrupt: boolean, element: Element | null): void;
}
