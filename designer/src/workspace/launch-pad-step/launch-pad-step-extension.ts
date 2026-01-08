import { SequentialStep } from 'sequential-workflow-model';
import { StepExtension } from '../../designer-extension';
import { LaunchPadStepExtensionConfiguration } from './launch-pad-step-extension-configuration';
import { createLaunchPadStepComponentViewFactory } from './launch-pad-step-component-view';
import { LaunchPadStepComponentViewConfiguration } from './launch-pad-step-component-view-configuration';

const defaultViewConfiguration: LaunchPadStepComponentViewConfiguration = {
	isRegionEnabled: true,
	paddingY: 10,
	connectionHeight: 20,
	emptyPaddingX: 20,
	emptyPaddingY: 20,
	emptyInputSize: 14,
	emptyOutputSize: 10,
	emptyIconSize: 24
};

export class LaunchPadStepExtension implements StepExtension<SequentialStep> {
	public static create(configuration?: LaunchPadStepExtensionConfiguration): LaunchPadStepExtension {
		return new LaunchPadStepExtension(configuration);
	}

	public readonly componentType = this.configuration?.componentType ?? 'launchPad';

	private constructor(private readonly configuration: LaunchPadStepExtensionConfiguration | undefined) {}

	public readonly createComponentView = createLaunchPadStepComponentViewFactory(
		false,
		this.configuration?.view ?? defaultViewConfiguration
	);
}
