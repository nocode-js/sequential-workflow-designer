import { DesignerContext } from '../../designer-context';
import { SetPreferencesClickCommand } from '../../workspace';
import { PressingBehaviorHandler } from './pressing-behavior';

export class ChangePreferencesBehaviorHandler implements PressingBehaviorHandler {
	public constructor(
		private readonly command: SetPreferencesClickCommand,
		private readonly designerContext: DesignerContext
	) {}

	public handle() {
		this.designerContext.state.setPreferences(this.command.changes, this.command.step.id);
	}
}
