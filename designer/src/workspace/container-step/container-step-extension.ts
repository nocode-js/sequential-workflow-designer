import { SequentialStep } from '../../definition';
import { StepChildren, StepChildrenType, StepExtension } from '../../designer-extension';
import { ContainerStepComponentView } from './container-step-component-view';

export class ContainerStepExtension implements StepExtension<SequentialStep> {
	public readonly componentType = 'container';

	public readonly createComponentView = ContainerStepComponentView.create;

	public getChildren(step: SequentialStep): StepChildren {
		return {
			type: StepChildrenType.singleSequence,
			sequences: step.sequence
		};
	}
}
