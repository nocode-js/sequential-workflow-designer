import { Sequence, Step } from '../definition';
import { StepComponent } from './component';
import { ComponentContext } from './component-context';
import { StepExtensionResolver } from './step-extension-resolver';

export class StepComponentFactory {
	public constructor(private readonly stepExtensionResolver: StepExtensionResolver) {}

	public create(parentElement: SVGElement, step: Step, parentSequence: Sequence, context: ComponentContext): StepComponent {
		const stepExtension = this.stepExtensionResolver.resolve(step.componentType);
		return stepExtension.createComponent(parentElement, step, parentSequence, context);
	}
}
