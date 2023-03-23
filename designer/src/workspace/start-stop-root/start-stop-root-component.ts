import { Sequence } from '../../definition';
import { RectPlaceholder } from '../placeholder/rect-placeholder';
import { BadgesResult, ClickDetails, ResolvedClick, Component, Placeholder } from '../component';
import { ComponentContext } from '../../component-context';
import { StartStopRootComponentView } from './start-stop-root-component-view';
import { SequencePlaceIndicator } from '../../designer-extension';
import { StepComponent } from '../step-component';

export class StartStopRootComponent implements Component {
	public static create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentSequencePlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): StartStopRootComponent {
		const view = StartStopRootComponentView.create(parentElement, sequence, !!parentSequencePlaceIndicator, context);
		return new StartStopRootComponent(view, parentSequencePlaceIndicator);
	}

	private constructor(
		public readonly view: StartStopRootComponentView,
		private readonly parentSequencePlaceIndicator: SequencePlaceIndicator | null
	) {}

	public resolveClick(click: ClickDetails): ResolvedClick | null {
		return this.view.component.resolveClick(click);
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

	public updateBadges(result: BadgesResult) {
		this.view.component.updateBadges(result);
	}
}
