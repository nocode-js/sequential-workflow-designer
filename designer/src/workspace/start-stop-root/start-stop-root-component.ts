import { Sequence } from '../../definition';
import { BadgesResult, ClickDetails, ClickCommand, Component, Placeholder } from '../component';
import { ComponentContext } from '../../component-context';
import { StartStopRootComponentView } from './start-stop-root-component-view';
import { SequencePlaceIndicator } from '../../designer-extension';
import { StepComponent } from '../step-component';

export class StartStopRootComponent implements Component {
	public static create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentPlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): StartStopRootComponent {
		const view = StartStopRootComponentView.create(parentElement, sequence, parentPlaceIndicator, context);
		return new StartStopRootComponent(view);
	}

	private constructor(public readonly view: StartStopRootComponentView) {}

	public resolveClick(click: ClickDetails): ClickCommand | null {
		return this.view.component.resolveClick(click);
	}

	public findById(stepId: string): StepComponent | null {
		return this.view.component.findById(stepId);
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.component.getPlaceholders(result);

		if (this.view.startPlaceholder && this.view.endPlaceholder) {
			result.push(this.view.startPlaceholder);
			result.push(this.view.endPlaceholder);
		}
	}

	public setIsDragging(isDragging: boolean) {
		this.view.component.setIsDragging(isDragging);

		if (this.view.startPlaceholder && this.view.endPlaceholder) {
			this.view.startPlaceholder.setIsVisible(isDragging);
			this.view.endPlaceholder.setIsVisible(isDragging);
		}
	}

	public updateBadges(result: BadgesResult) {
		this.view.badges.update(result);
		this.view.component.updateBadges(result);
	}
}
