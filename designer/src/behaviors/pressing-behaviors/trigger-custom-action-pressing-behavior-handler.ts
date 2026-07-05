import { CustomActionApi } from '../../api/custom-action-api';
import { TriggerCustomActionClickCommand } from '../../workspace';
import { PressingBehaviorHandler } from './pressing-behavior';

export class TriggerCustomActionPressingBehaviorHandler implements PressingBehaviorHandler {
	public constructor(
		private readonly command: TriggerCustomActionClickCommand,
		private readonly api: CustomActionApi
	) {}

	public handle() {
		this.api.trigger(this.command.action, this.command.step, this.command.sequence);
	}
}
