import { SwitchStep } from '../../definition';
import { StepChildren, StepChildrenType, StepExtension } from '../../designer-extension';
import { SwitchStepComponent } from './switch-step-component';

export class SwitchStepExtension implements StepExtension<SwitchStep> {
	public readonly componentType = 'switch';

	public readonly createComponent = SwitchStepComponent.create;

	public getChildren(step: SwitchStep): StepChildren {
		return {
			type: StepChildrenType.branches,
			sequences: step.branches
		};
	}
}
