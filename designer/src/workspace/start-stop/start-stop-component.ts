import { Sequence } from '../../definition';
import { RectPlaceholder } from '../common-views/rect-placeholder';
import { ClickDetails, ClickResult, Component, Placeholder, StepComponent } from '../component';
import { ComponentContext } from '../component-context';
import { StartStopComponentView } from './start-stop-component-view';

export interface SequencePlaceIndicator {
	sequence: Sequence;
	index: number;
}

export class StartStopComponent implements Component {
	public static create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentSequencePlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): StartStopComponent {
		const view = StartStopComponentView.create(parentElement, sequence, !!parentSequencePlaceIndicator, context);
		return new StartStopComponent(view, parentSequencePlaceIndicator);
	}

	public readonly isInterrupted = false;

	private constructor(
		public readonly view: StartStopComponentView,
		private readonly parentSequencePlaceIndicator: SequencePlaceIndicator | null
	) {}

	public findByClick(click: ClickDetails): ClickResult | null {
		return this.view.component.findByClick(click);
	}

	public findById(stepId: string): StepComponent | null {
		return this.view.component.findById(stepId);
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.component.getPlaceholders(result);

		if (this.parentSequencePlaceIndicator && this.view.startPlaceholderView && this.view.endPlaceholderView) {
			const { index, sequence } = this.parentSequencePlaceIndicator;

			result.push(new RectPlaceholder(this.view.startPlaceholderView, sequence, index));
			result.push(new RectPlaceholder(this.view.endPlaceholderView, sequence, index + 1));
		}
	}

	public setIsDragging(isDragging: boolean) {
		this.view.component.setIsDragging(isDragging);
		if (this.view.startPlaceholderView && this.view.endPlaceholderView) {
			this.view.startPlaceholderView.setIsVisible(isDragging);
			this.view.endPlaceholderView.setIsVisible(isDragging);
		}
	}

	public validate(): boolean {
		return this.view.component.validate();
	}

	public destroy() {
		this.view.destroy();
	}
}
