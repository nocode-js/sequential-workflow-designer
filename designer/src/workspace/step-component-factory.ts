import { Sequence, Step } from '../definition';
import { StepComponent } from './component';
import { ComponentContext, StepExtensionDictionary } from './component-context';

export class StepComponentFactory {
	public constructor(private readonly extensions: StepExtensionDictionary) {}

	public create(parentElement: SVGElement, step: Step, parentSequence: Sequence, context: ComponentContext): StepComponent {
		const extension = this.extensions[step.componentType];
		if (!extension) {
			throw new Error(`Unknown component type: ${step.componentType}`);
		}
		return extension.createComponent(parentElement, step, parentSequence, context);
	}
}
