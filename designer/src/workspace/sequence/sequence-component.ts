import { Sequence } from '../../definition';
import { Component, Placeholder, StepComponent } from '../component';
import { SequencePlaceholder } from './sequence-placeholder';
import { SequenceComponentView } from './sequence-component-view';
import { ComponentContext } from '../component-context';

export class SequenceComponent implements Component {
	public static create(parentElement: SVGElement, sequence: Sequence, context: ComponentContext): SequenceComponent {
		const view = SequenceComponentView.create(parentElement, sequence, context);
		return new SequenceComponent(view, sequence);
	}

	public get isStop() {
		return this.view.components.length > 0 ? this.view.components[this.view.components.length - 1].isStop : false;
	}

	private constructor(public readonly view: SequenceComponentView, private readonly sequence: Sequence) {}

	public findByElement(element: Element): StepComponent | null {
		for (const component of this.view.components) {
			const sc = component.findByElement(element);
			if (sc) {
				return sc;
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
		let isValid = true;
		for (const component of this.view.components) {
			isValid = component.validate() && isValid;
		}
		return isValid;
	}
}
