import { BranchedStep } from '../../definition';
import { StepExtension } from '../../designer-extension';
import { createSwitchStepComponentViewFactory } from './switch-step-component-view';
import { SwitchStepExtensionConfiguration } from './switch-step-extension-configuration';

const defaultConfiguration: SwitchStepExtensionConfiguration = {
	view: {
		minContainerWidth: 40,
		paddingX: 20,
		paddingTop: 20,
		connectionHeight: 16,
		inputSize: 18,
		inputIconSize: 14,
		branchNameLabel: {
			height: 22,
			paddingX: 10,
			minWidth: 50,
			radius: 10
		},
		nameLabel: {
			height: 22,
			paddingX: 10,
			minWidth: 50,
			radius: 10
		}
	}
};

export class SwitchStepExtension implements StepExtension<BranchedStep> {
	public static create(configuration?: SwitchStepExtensionConfiguration): SwitchStepExtension {
		return new SwitchStepExtension(configuration ?? defaultConfiguration);
	}

	public readonly componentType = 'switch';

	private constructor(private readonly configuration: SwitchStepExtensionConfiguration) {}

	public readonly createComponentView = createSwitchStepComponentViewFactory(this.configuration.view);
}
