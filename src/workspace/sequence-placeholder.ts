import { Sequence } from '../definition';
import { Placeholder } from './component';

export class SequencePlaceholder implements Placeholder {

	public constructor(
		public readonly element: Element,
		public readonly parentSequence: Sequence,
		public readonly index: number) {
	}

	public setIsHover(isHover: boolean) {
		if (isHover) {
			this.element.classList.add('sqd-hover');
		} else {
			this.element.classList.remove('sqd-hover');
		}
	}
}
