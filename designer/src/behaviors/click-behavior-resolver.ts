import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { ClickCommand, ClickCommandType } from '../workspace';
import { Behavior } from './behavior';
import { MoveViewportBehavior } from './move-viewport-behavior';
import { SelectStepBehavior } from './select-step-behavior';
import { PressingBehavior } from './pressing-behaviors/pressing-behavior';
import { RerenderStepPressingBehaviorHandler } from './pressing-behaviors/rerender-step-pressing-behavior-handler';
import { OpenFolderPressingBehaviorHandler } from './pressing-behaviors/open-folder-pressing-behavior-handler';
import { TriggerCustomActionPressingBehaviorHandler } from './pressing-behaviors/trigger-custom-action-pressing-behavior-handler';

export class ClickBehaviorResolver {
	public constructor(private readonly designerContext: DesignerContext, private readonly state: DesignerState) {}

	public resolve(commandOrNull: ClickCommand | null, element: Element, isMiddleButton: boolean): Behavior {
		if (!commandOrNull) {
			return MoveViewportBehavior.create(this.state, !isMiddleButton);
		}

		switch (commandOrNull.type) {
			case ClickCommandType.selectStep:
				return SelectStepBehavior.create(commandOrNull.component, isMiddleButton, this.designerContext);

			case ClickCommandType.rerenderStep:
				return PressingBehavior.create(element, new RerenderStepPressingBehaviorHandler(this.designerContext));

			case ClickCommandType.openFolder:
				return PressingBehavior.create(element, new OpenFolderPressingBehaviorHandler(commandOrNull, this.designerContext));

			case ClickCommandType.triggerCustomAction:
				return PressingBehavior.create(
					element,
					new TriggerCustomActionPressingBehaviorHandler(commandOrNull, this.designerContext)
				);

			default:
				throw new Error('Not supported behavior type');
		}
	}
}
