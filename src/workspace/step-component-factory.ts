import { Step, StepType, SwitchStep, TaskStep } from '../definition';
import { Component } from './component';
import { SwitchStepComponent } from './switch-step-component';
import { TaskStepComponent } from './task-step-component';

export class StepComponentFactory {

	public static create(step: Step): Component {
		switch (step.type) {
			case StepType.task:
				return TaskStepComponent.create(step as TaskStep);
			case StepType.switch:
				return SwitchStepComponent.create(step as SwitchStep);
			default:
				throw new Error('Unknown step');
		}
	}
}
