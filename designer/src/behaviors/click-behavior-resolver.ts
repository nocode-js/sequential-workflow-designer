import { Vector } from '../core';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { ClickCommandType, ClickDetails, Component } from '../workspace';
import { Behavior } from './behavior';
import { MoveViewportBehavior } from './move-viewport-behavior';
import { SelectStepBehavior } from './select-step-behavior';
import { PressingBehavior } from './pressing-behaviors/pressing-behavior';
import { RerenderStepPressingBehaviorHandler } from './pressing-behaviors/rerender-step-pressing-behavior-handler';
import { OpenFolderPressingBehaviorHandler } from './pressing-behaviors/open-folder-pressing-behavior-handler';
import { TriggerCustomActionPressingBehaviorHandler } from './pressing-behaviors/trigger-custom-action-pressing-behavior-handler';

export class ClickBehaviorResolver {
	public constructor(private readonly designerContext: DesignerContext, private readonly state: DesignerState) {}

	public resolve(rootComponent: Component, element: Element, position: Vector, forceDisableDrag: boolean): Behavior {
		const click: ClickDetails = {
			element,
			position,
			scale: this.state.viewport.scale
		};

		const command = rootComponent.resolveClick(click);
		if (!command) {
			return MoveViewportBehavior.create(this.state, true);
		}

		switch (command.type) {
			case ClickCommandType.selectStep:
				return SelectStepBehavior.create(command.component, forceDisableDrag, this.designerContext);

			case ClickCommandType.rerenderStep:
				return PressingBehavior.create(element, new RerenderStepPressingBehaviorHandler(this.designerContext));

			case ClickCommandType.openFolder:
				return PressingBehavior.create(element, new OpenFolderPressingBehaviorHandler(command, this.designerContext));

			case ClickCommandType.triggerCustomAction:
				return PressingBehavior.create(element, new TriggerCustomActionPressingBehaviorHandler(command, this.designerContext));

			default:
				throw new Error('Not supported behavior type');
		}
	}
}
