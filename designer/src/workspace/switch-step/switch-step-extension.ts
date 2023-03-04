import { BranchedStep } from '../../definition';
import { StepChildren, StepChildrenType, StepExtension } from '../../designer-extension';
import { SwitchStepComponent } from './switch-step-component';

export class SwitchStepExtension implements StepExtension<BranchedStep> {
	public readonly componentType = 'switch';

	public readonly createComponent = SwitchStepComponent.create;

	public getChildren(step: BranchedStep): StepChildren {
		return {
			type: StepChildrenType.branches,
			sequences: step.branches
		};
	}
}
