import { SequentialStep } from '../../definition';
import { StepExtension } from '../../designer-extension';
import { createContainerStepComponentViewFactory } from './container-step-component-view';
import { ContainerStepExtensionConfiguration } from './container-step-extension-configuration';

const defaultConfiguration: ContainerStepExtensionConfiguration = {
	view: {
		paddingTop: 20,
		paddingX: 20,
		inputSize: 18,
		inputRadius: 4,
		inputIconSize: 14,
		autoHideInputOnDrag: true,
		label: {
			height: 22,
			paddingX: 10,
			minWidth: 50,
			radius: 10
		}
	}
};

export class ContainerStepExtension implements StepExtension<SequentialStep> {
	public static create(configuration?: ContainerStepExtensionConfiguration): ContainerStepExtension {
		return new ContainerStepExtension(configuration ?? defaultConfiguration);
	}

	public readonly componentType = 'container';

	private constructor(private readonly configuration: ContainerStepExtensionConfiguration) {}

	public readonly createComponentView = createContainerStepComponentViewFactory(this.configuration.view);
}
