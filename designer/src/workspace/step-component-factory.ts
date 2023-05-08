import { ComponentContext } from '../component-context';
import { StepExtensionResolver } from './step-extension-resolver';
import { StepComponent } from './step-component';
import { StepComponentViewContextFactory } from './step-component-view-context-factory';
import { StepContext } from '../designer-extension';

export class StepComponentFactory {
	public constructor(private readonly stepExtensionResolver: StepExtensionResolver) {}

	public create(parentElement: SVGElement, stepContext: StepContext, componentContext: ComponentContext): StepComponent {
		const viewContext = StepComponentViewContextFactory.create(stepContext, componentContext);
		const extension = this.stepExtensionResolver.resolve(stepContext.step.componentType);
		const view = extension.createComponentView(parentElement, stepContext, viewContext);
		const wrappedView = componentContext.services.stepComponentViewWrapper.wrap(view, stepContext);
		return StepComponent.create(wrappedView, stepContext, componentContext);
	}
}
