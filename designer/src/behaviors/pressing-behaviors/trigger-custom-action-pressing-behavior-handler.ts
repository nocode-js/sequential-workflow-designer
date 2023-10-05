import { CustomActionHandlerContext, DefinitionChangeType } from '../../designer-configuration';
import { DesignerContext } from '../../designer-context';
import { TriggerCustomActionClickCommand } from '../../workspace';
import { PressingBehaviorHandler } from './pressing-behavior';

export class TriggerCustomActionPressingBehaviorHandler implements PressingBehaviorHandler {
	public constructor(private readonly command: TriggerCustomActionClickCommand, private readonly designerContext: DesignerContext) {}

	public handle() {
		const customActionHandler = this.designerContext.configuration.customActionHandler;
		if (!customActionHandler) {
			console.warn(`Custom action handler is not defined (action type: ${this.command.action.type})`);
			return;
		}

		const context = this.createContext();
		customActionHandler(this.command.action, this.command.step, this.command.sequence, context);
	}

	private createContext(): CustomActionHandlerContext {
		return {
			notifyStepNameChanged: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepNameChanged, stepId),
			notifyStepPropertiesChanged: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepPropertyChanged, stepId),
			notifyStepInserted: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepInserted, stepId),
			notifyStepMoved: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepMoved, stepId),
			notifyStepDeleted: (stepId: string) => this.notifyStepChanged(DefinitionChangeType.stepDeleted, stepId)
		};
	}

	private notifyStepChanged(changeType: DefinitionChangeType, stepId: string) {
		if (!stepId) {
			throw new Error('Step id is empty');
		}
		this.designerContext.state.notifyDefinitionChanged(changeType, stepId);
	}
}
