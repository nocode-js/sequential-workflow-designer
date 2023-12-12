import { Vector } from './vector';

export function getAbsolutePosition(element: Element): Vector {
	const rect = element.getBoundingClientRect();
	return new Vector(rect.x + window.scrollX, rect.y + window.scrollY);
}
