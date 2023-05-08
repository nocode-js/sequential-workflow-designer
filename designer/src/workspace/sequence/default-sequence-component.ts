import { BadgesResult, ClickCommand, ClickDetails, Placeholder, SequenceComponent } from '../component';
import { DefaultSequenceComponentView } from './default-sequence-component-view';
import { ComponentContext } from '../../component-context';
import { StepComponent } from '../step-component';
import { SequenceContext } from '../../designer-extension';

export class DefaultSequenceComponent implements SequenceComponent {
	public static create(parentElement: SVGElement, sequenceContext: SequenceContext, context: ComponentContext): DefaultSequenceComponent {
		const view = DefaultSequenceComponentView.create(parentElement, sequenceContext, context);
		return new DefaultSequenceComponent(view, view.hasOutput());
	}

	private constructor(public readonly view: DefaultSequenceComponentView, public readonly hasOutput: boolean) {}

	public resolveClick(click: ClickDetails): ClickCommand | null {
		for (const component of this.view.components) {
			const result = component.resolveClick(click);
			if (result) {
				return result;
			}
		}
		for (const placeholder of this.view.placeholders) {
			const result = placeholder.resolveClick(click);
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
		this.view.placeholders.forEach(placeholder => result.push(placeholder));
		this.view.components.forEach(c => c.getPlaceholders(result));
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
		this.view.components.forEach(c => c.setIsDragging(isDragging));
	}

	public updateBadges(result: BadgesResult) {
		for (const component of this.view.components) {
			component.updateBadges(result);
		}
	}
}
