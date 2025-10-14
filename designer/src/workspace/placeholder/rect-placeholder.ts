import { Vector } from '../../core';
import { Sequence } from '../../definition';
import { Placeholder } from '../component';
import { RectPlaceholderView } from './rect-placeholder-view';

export class RectPlaceholder implements Placeholder {
	public static create(
		parent: SVGElement,
		size: Vector,
		parentSequence: Sequence,
		index: number,
		radius: number,
		iconD: string | undefined,
		iconSize: number
	): RectPlaceholder {
		const view = RectPlaceholderView.create(parent, size.x, size.y, radius, iconD, iconSize);
		return new RectPlaceholder(view, parentSequence, index);
	}

	public constructor(
		public readonly view: RectPlaceholderView,
		public readonly parentSequence: Sequence,
		public readonly index: number
	) {}

	public getClientRect(): DOMRect {
		return this.view.rect.getBoundingClientRect();
	}

	public setIsHover(isHover: boolean) {
		this.view.setIsHover(isHover);
	}

	public setIsVisible(isVisible: boolean) {
		this.view.setIsVisible(isVisible);
	}

	public resolveClick(): null {
		return null;
	}
}
