import { Sequence } from '../../definition';
import { BadgesResult, ClickDetails, ClickCommand, Component, FoundPlaceholders } from '../component';
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

	public resolvePlaceholders(skipComponent: StepComponent | undefined, result: FoundPlaceholders) {
		this.view.component.resolvePlaceholders(skipComponent, result);

		if (this.view.startPlaceholder && this.view.endPlaceholder) {
			result.placeholders.push(this.view.startPlaceholder);
			result.placeholders.push(this.view.endPlaceholder);
		}
	}

	public updateBadges(result: BadgesResult) {
		this.view.badges.update(result);
		this.view.component.updateBadges(result);
	}
}
