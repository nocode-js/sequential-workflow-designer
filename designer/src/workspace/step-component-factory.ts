import { StepComponent } from './component';
import { ComponentContext } from '../component-context';
import { StepExtensionResolver } from './step-extension-resolver';
import { StepContext } from '../designer-extension';

export class StepComponentFactory {
	public constructor(private readonly stepExtensionResolver: StepExtensionResolver) {}

	public create(parentElement: SVGElement, stepContext: StepContext, componentContext: ComponentContext): StepComponent {
		const extension = this.stepExtensionResolver.resolve(stepContext.step.componentType);
		return extension.createComponent(parentElement, stepContext, componentContext);
	}
}
