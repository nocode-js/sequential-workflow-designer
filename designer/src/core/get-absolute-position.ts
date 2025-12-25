import { Vector } from './vector';

export function getAbsolutePosition(element: Element): Vector {
	const rect = element.getBoundingClientRect();
	return new Vector(rect.left + window.scrollX, rect.top + window.scrollY);
}
