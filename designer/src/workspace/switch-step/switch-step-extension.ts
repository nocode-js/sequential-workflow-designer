import { BranchedStep } from '../../definition';
import { StepChildren, StepChildrenType, StepExtension } from '../../designer-extension';
import { SwitchStepComponentView } from './switch-step-component-view';

export class SwitchStepExtension implements StepExtension<BranchedStep> {
	public readonly componentType = 'switch';

	public readonly createComponentView = SwitchStepComponentView.create;

	public getChildren(step: BranchedStep): StepChildren {
		return {
			type: StepChildrenType.branches,
			sequences: step.branches
		};
	}
}
