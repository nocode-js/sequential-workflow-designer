import { Vector } from './vector';

export function readMousePosition(e: MouseEvent): Vector {
	return new Vector(e.clientX, e.clientY);
}

export function readTouchPosition(e: TouchEvent): Vector {
	if (e.touches.length > 0) {
		const touch = e.touches[0];
		return new Vector(touch.clientX, touch.clientY);
	}
	throw new Error('Unknown touch position');
}
