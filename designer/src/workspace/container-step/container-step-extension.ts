import { ContainerStep } from '../../definition';
import { StepChildren, StepChildrenType, StepExtension } from '../../designer-extension';
import { ContainerStepComponent } from './container-step-component';

export class ContainerStepExtension implements StepExtension<ContainerStep> {
	public readonly componentType = 'container';

	public readonly createComponent = ContainerStepComponent.create;

	public getChildren(step: ContainerStep): StepChildren {
		return {
			type: StepChildrenType.singleSequence,
			sequences: step.sequence
		};
	}
}
