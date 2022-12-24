import { Sequence } from '../../definition';
import { Component, Placeholder, StepComponent } from '../component';
import { ComponentContext } from '../component-context';
import { StartStopComponentView } from './start-stop-component-view';

export class StartStopComponent implements Component {
	public static create(parentElement: SVGElement, sequence: Sequence, context: ComponentContext): StartStopComponent {
		const view = StartStopComponentView.create(parentElement, sequence, context);
		return new StartStopComponent(view);
	}

	public readonly isInterrupted = false;

	private constructor(public readonly view: StartStopComponentView) {}

	public findByElement(element: Element): StepComponent | null {
		return this.view.component.findByElement(element);
	}

	public findById(stepId: string): StepComponent | null {
		return this.view.component.findById(stepId);
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.component.getPlaceholders(result);
	}

	public setIsDragging(isDragging: boolean) {
		this.view.component.setIsDragging(isDragging);
	}

	public validate(): boolean {
		return this.view.component.validate();
	}
}
