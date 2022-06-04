import { Sequence } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { Component, Placeholder, StepComponent } from '../component';
import { SequencePlaceholder } from './sequence-placeholder';
import { SequenceComponentView } from './sequence-component-view';

export class SequenceComponent implements Component {

	public static create(parent: SVGElement, sequence: Sequence, configuration: StepsConfiguration): SequenceComponent {
		const view = SequenceComponentView.create(parent, sequence, configuration);
		return new SequenceComponent(view, sequence);
	}

	private constructor(
		public readonly view: SequenceComponentView,
		private readonly sequence: Sequence) {
	}

	public findByElement(element: Element): StepComponent | null {
		for (let component of this.view.components) {
			const sc = component.findByElement(element);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public findById(stepId: string): StepComponent | null {
		for (let component of this.view.components) {
			const sc = component.findById(stepId);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.placeholders.forEach((ph, index) => {
			result.push(new SequencePlaceholder(ph, this.sequence, index));
		});
		this.view.components.forEach(c => c.getPlaceholders(result));
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
		this.view.components.forEach(c => c.setIsDragging(isDragging));
	}

	public validate(): boolean {
		return this.view.components.every(c => c.validate());
	}
}
