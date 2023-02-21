import { Sequence } from '../../definition';
import { ClickDetails, ClickResult, Component, Placeholder, StepComponent } from '../component';
import { SequenceComponentView } from './sequence-component-view';
import { ComponentContext } from '../../component-context';
import { RectPlaceholder } from '../placeholder/rect-placeholder';
import { SequenceContext } from './sequence-context';

export class SequenceComponent implements Component {
	public static create(parentElement: SVGElement, sequenceContext: SequenceContext, context: ComponentContext): SequenceComponent {
		const view = SequenceComponentView.create(parentElement, sequenceContext, context);
		return new SequenceComponent(view, view.hasOutput(), sequenceContext.sequence);
	}

	private constructor(
		public readonly view: SequenceComponentView,
		public readonly hasOutput: boolean,
		private readonly sequence: Sequence
	) {}

	public findByClick(click: ClickDetails): ClickResult | null {
		for (const component of this.view.components) {
			const result = component.findByClick(click);
			if (result) {
				return result;
			}
		}
		return null;
	}

	public findById(stepId: string): StepComponent | null {
		for (const component of this.view.components) {
			const sc = component.findById(stepId);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.placeholderViews.forEach(view => {
			result.push(new RectPlaceholder(view, this.sequence, view.index));
		});
		this.view.components.forEach(c => c.getPlaceholders(result));
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
		this.view.components.forEach(c => c.setIsDragging(isDragging));
	}

	public validate(): boolean {
		let isValid = true;
		for (const component of this.view.components) {
			isValid = component.validate() && isValid;
		}
		return isValid;
	}
}
