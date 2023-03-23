import { ComponentContext } from '../component-context';
import { StepExtensionResolver } from './step-extension-resolver';
import { StepContext } from '../designer-extension';
import { StepComponent } from './step-component';

export class StepComponentFactory {
	public constructor(private readonly stepExtensionResolver: StepExtensionResolver) {}

	public create(parentElement: SVGElement, stepContext: StepContext, componentContext: ComponentContext): StepComponent {
		const extension = this.stepExtensionResolver.resolve(stepContext.step.componentType);
		const view = extension.createComponentView(parentElement, stepContext, componentContext);
		return StepComponent.create(view, stepContext, componentContext);
	}
}
