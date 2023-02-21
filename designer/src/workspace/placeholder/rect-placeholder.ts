import { Sequence } from '../../definition';
import { Placeholder } from '../component';
import { RectPlaceholderView } from '../common-views/rect-placeholder-view';

export class RectPlaceholder implements Placeholder {
	public constructor(
		public readonly view: RectPlaceholderView,
		public readonly parentSequence: Sequence,
		public readonly index: number
	) {}

	public getRect(): DOMRect {
		return this.view.rect.getBoundingClientRect();
	}

	public setIsHover(isHover: boolean) {
		this.view.setIsHover(isHover);
	}
}
