import { Sequence, Step } from './definition';
import { CustomAction, DefinitionChangeType, DesignerConfiguration } from './designer-configuration';
import { DesignerState } from './designer-state';
import { StateModifier } from './modifier/state-modifier';

export class CustomActionController {
	public constructor(
		private readonly configuration: DesignerConfiguration,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier
	) {}

	public trigger(action: CustomAction, step: Step | null, sequence: Sequence) {
		const handler = this.configuration.customActionHandler;
		if (!handler) {
			console.warn(`Custom action handler is not defined (action type: ${action.type})`);
			return;
		}

		const context = this.createCustomActionHandlerContext();
		handler(action, step, sequence, context);
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
