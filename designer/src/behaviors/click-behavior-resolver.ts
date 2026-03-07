import { DesignerContext } from '../designer-context';
import { ClickCommand, ClickCommandType } from '../workspace';
import { Behavior } from './behavior';
import { MoveViewportBehavior } from './move-viewport-behavior';
import { SelectStepBehavior } from './select-step-behavior';
import { PressingBehavior } from './pressing-behaviors/pressing-behavior';
import { ChangePreferencesBehaviorHandler } from './pressing-behaviors/change-preferences-behavior-handler';
import { OpenFolderPressingBehaviorHandler } from './pressing-behaviors/open-folder-pressing-behavior-handler';
import { TriggerCustomActionPressingBehaviorHandler } from './pressing-behaviors/trigger-custom-action-pressing-behavior-handler';

export class ClickBehaviorResolver {
	public constructor(private readonly context: DesignerContext) {}

	public resolve(commandOrNull: ClickCommand | null, element: Element, forceMove: boolean): Behavior {
		if (!commandOrNull) {
			return MoveViewportBehavior.create(!forceMove, this.context);
		}

		switch (commandOrNull.type) {
			case ClickCommandType.selectStep:
				return SelectStepBehavior.create(commandOrNull.component, forceMove, this.context);

			case ClickCommandType.changePreferences:
				return PressingBehavior.create(element, new ChangePreferencesBehaviorHandler(commandOrNull, this.context));

			case ClickCommandType.openFolder:
				return PressingBehavior.create(element, new OpenFolderPressingBehaviorHandler(commandOrNull, this.context));

			case ClickCommandType.triggerCustomAction:
				return PressingBehavior.create(
					element,
					new TriggerCustomActionPressingBehaviorHandler(commandOrNull, this.context.customActionController)
				);

			default:
				throw new Error('Not supported behavior type');
		}
	}
}
