import { ComponentContext } from '../../component-context';
import { SequentialStep } from '../../definition';
import { StepChildren, StepChildrenType, StepContext, StepExtension } from '../../designer-extension';
import { StepComponentView } from '../component';
import { ContainerStepComponentView } from './container-step-component-view';
import { ContainerStepExtensionConfiguration } from './container-step-extension-configuration';

const defaultConfiguration: ContainerStepExtensionConfiguration = {
	view: {
		paddingTop: 20,
		paddingX: 20,
		inputSize: 18,
		inputIconSize: 14,
		labelHeight: 22,
		labelPaddingX: 10,
		labelMinWidth: 50,
		labelRadius: 10
	}
};

export class ContainerStepExtension implements StepExtension<SequentialStep> {
	public static create(configuration?: ContainerStepExtensionConfiguration): ContainerStepExtension {
		return new ContainerStepExtension(configuration ?? defaultConfiguration);
	}

	public readonly componentType = 'container';

	private constructor(private readonly configuration: ContainerStepExtensionConfiguration) {}

	public createComponentView(
		parentElement: SVGElement,
		stepContext: StepContext<SequentialStep>,
		componentContext: ComponentContext
	): StepComponentView {
		return ContainerStepComponentView.create(parentElement, stepContext, componentContext, this.configuration.view);
	}

	public getChildren(step: SequentialStep): StepChildren {
		return {
			type: StepChildrenType.singleSequence,
			sequences: step.sequence
		};
	}
}
