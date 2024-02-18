import { Sequence, Step } from './definition';
import { CustomAction, DefinitionChangeType, DesignerConfiguration } from './designer-configuration';
import { DesignerState } from './designer-state';

export class CustomActionController {
	public constructor(private readonly configuration: DesignerConfiguration, private readonly state: DesignerState) {}

	public trigger(action: CustomAction, step: Step | null, sequence: Sequence) {
		const handler = this.configuration.customActionHandler;
		if (!handler) {
			console.warn(`Custom action handler is not defined (action type: ${action.type})`);
			return;
		}

		const context = {
			notifyStepNameChanged: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepNameChanged, stepId),
			notifyStepPropertiesChanged: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepPropertyChanged, stepId),
			notifyStepInserted: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepInserted, stepId),
			notifyStepMoved: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepMoved, stepId),
			notifyStepDeleted: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepDeleted, stepId)
		};
		handler(action, step, sequence, context);
	}

	private notifyStepChanged(changeType: DefinitionChangeType, stepId: string) {
		if (!stepId) {
			throw new Error('Step id is empty');
		}
		this.state.notifyDefinitionChanged(changeType, stepId);
	}
}
