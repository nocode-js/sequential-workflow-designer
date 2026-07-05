import { Sequence, Step } from 'sequential-workflow-model';
import { CustomAction, CustomActionHandler, DefinitionChangeType } from '../designer-configuration';
import { DesignerState } from '../designer-state';
import { StateModifier } from '../modifier/state-modifier';

export class CustomActionApi {
	public constructor(
		private readonly customActionHandler: CustomActionHandler | undefined,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier
	) {}

	public trigger(action: CustomAction, step: Step | null, sequence: Sequence) {
		if (!this.customActionHandler) {
			console.warn(`Custom action handler is not defined (action type: ${action.type})`);
			return;
		}

		const context = this.createCustomActionHandlerContext();
		this.customActionHandler(action, step, sequence, context);
	}

	private createCustomActionHandlerContext() {
		return {
			notifyStepNameChanged: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepNameChanged, stepId, false),
			notifyStepPropertiesChanged: (stepId: string) =>
				this.notifyStepChanged(DefinitionChangeType.stepPropertyChanged, stepId, false),
			notifyStepInserted: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepInserted, stepId, true),
			notifyStepMoved: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepMoved, stepId, true),
			notifyStepDeleted: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepDeleted, stepId, true)
		};
	}

	private notifyStepChanged(changeType: DefinitionChangeType, stepId: string, updateDependencies: boolean) {
		if (!stepId) {
			throw new Error('Step id is empty');
		}
		this.state.notifyDefinitionChanged(changeType, stepId);
		if (updateDependencies) {
			this.stateModifier.updateDependencies();
		}
	}
}
