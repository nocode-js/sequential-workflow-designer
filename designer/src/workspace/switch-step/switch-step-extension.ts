import { BranchedStep } from '../../definition';
import { StepExtension } from '../../designer-extension';
import { createSwitchStepComponentViewFactory } from './switch-step-component-view';
import { SwitchStepComponentViewConfiguration } from './switch-step-component-view-configuration';
import { SwitchStepExtensionConfiguration } from './switch-step-extension-configuration';

const defaultViewConfiguration: SwitchStepComponentViewConfiguration = {
	minBranchWidth: 88,
	paddingX: 20,
	paddingTop1: 0,
	paddingTop2: 22,
	connectionHeight: 20,
	noBranchPaddingBottom: 24,
	inputSize: 18,
	inputIconSize: 14,
	inputRadius: 4,
	autoHideInputOnDrag: true,
	isRegionClickable: true,
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
};

export class SwitchStepExtension implements StepExtension<BranchedStep> {
	public static create(configuration?: SwitchStepExtensionConfiguration): SwitchStepExtension {
		return new SwitchStepExtension(configuration);
	}

	public readonly componentType = this.configuration?.componentType ?? 'switch';

	private constructor(private readonly configuration: SwitchStepExtensionConfiguration | undefined) {}

	public readonly createComponentView = createSwitchStepComponentViewFactory(
		this.configuration?.view ?? defaultViewConfiguration,
		this.configuration?.branchNamesResolver
	);
}
