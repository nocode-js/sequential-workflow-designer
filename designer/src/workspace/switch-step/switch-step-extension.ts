import { ComponentContext } from '../../component-context';
import { BranchedStep } from '../../definition';
import { StepChildren, StepChildrenType, StepContext, StepExtension } from '../../designer-extension';
import { SwitchStepComponentView } from './switch-step-component-view';
import { SwitchStepExtensionConfiguration } from './switch-step-extension-configuration';

const defaultConfiguration: SwitchStepExtensionConfiguration = {
	view: {
		minContainerWidth: 40,
		paddingX: 20,
		paddingTop: 20,
		connectionHeight: 16,
		inputSize: 18,
		inputIconSize: 14,
		labelHeight: 22,
		labelPaddingX: 10,
		labelMinWidth: 50,
		labelRadius: 10
	}
};

export class SwitchStepExtension implements StepExtension<BranchedStep> {
	public static create(configuration?: SwitchStepExtensionConfiguration): SwitchStepExtension {
		return new SwitchStepExtension(configuration ?? defaultConfiguration);
	}

	public readonly componentType = 'switch';

	private constructor(private readonly configuration: SwitchStepExtensionConfiguration) {}

	public createComponentView(
		parentElement: SVGElement,
		stepContext: StepContext<BranchedStep>,
		componentContext: ComponentContext
	): SwitchStepComponentView {
		return SwitchStepComponentView.create(parentElement, stepContext, componentContext, this.configuration.view);
	}

	public getChildren(step: BranchedStep): StepChildren {
		return {
			type: StepChildrenType.branches,
			sequences: step.branches
		};
	}
}
