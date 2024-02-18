import { CustomActionController } from '../../custom-action-controller';
import { TriggerCustomActionClickCommand } from '../../workspace';
import { PressingBehaviorHandler } from './pressing-behavior';

export class TriggerCustomActionPressingBehaviorHandler implements PressingBehaviorHandler {
	public constructor(
		private readonly command: TriggerCustomActionClickCommand,
		private readonly customActionController: CustomActionController
	) {}

	public handle() {
		this.customActionController.trigger(this.command.action, this.command.step, this.command.sequence);
	}
}
