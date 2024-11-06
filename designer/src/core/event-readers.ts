import { Vector } from './vector';

export function readMousePosition(e: MouseEvent): Vector {
	return new Vector(e.pageX, e.pageY);
}

export function readTouchClientPosition(e: TouchEvent): Vector {
	if (e.touches.length > 0) {
		const touch = e.touches[0];
		return new Vector(touch.clientX, touch.clientY);
	}
	throw new Error('Unknown touch position');
}

export function readTouchPosition(e: TouchEvent): Vector {
	if (e.touches.length > 0) {
		const touch = e.touches[0];
		return new Vector(touch.pageX, touch.pageY);
	}
	throw new Error('Unknown touch position');
}

export function calculateFingerDistance(e: TouchEvent): number {
	if (e.touches.length === 2) {
		const t0 = e.touches[0];
		const t1 = e.touches[1];
		return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
	}
	throw new Error('Cannot calculate finger distance');
}

export function readFingerCenterPoint(e: TouchEvent): Vector {
	if (e.touches.length === 2) {
		const t0 = e.touches[0];
		const t1 = e.touches[1];
		return new Vector((t0.pageX + t1.pageX) / 2, (t0.pageY + t1.pageY) / 2);
	}
	throw new Error('Cannot calculate finger center point');
}
