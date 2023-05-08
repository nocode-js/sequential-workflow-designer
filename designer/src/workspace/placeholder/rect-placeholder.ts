import { Vector } from '../../core';
import { Sequence } from '../../definition';
import { Placeholder, PlaceholderDirection } from '../component';
import { RectPlaceholderConfiguration } from './rect-placeholder-configuration';
import { RectPlaceholderView } from './rect-placeholder-view';

export class RectPlaceholder implements Placeholder {
	public static create(
		parent: SVGElement,
		size: Vector,
		direction: PlaceholderDirection,
		sequence: Sequence,
		index: number,
		configuration: RectPlaceholderConfiguration
	): RectPlaceholder {
		const view = RectPlaceholderView.create(parent, size.x, size.y, configuration.radius, configuration.iconSize, direction);
		return new RectPlaceholder(view, sequence, index);
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
