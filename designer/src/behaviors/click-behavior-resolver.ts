import { Vector } from '../core';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { ClickBehaviorType, ClickDetails, Component, ComponentContext } from '../workspace';
import { Behavior } from './behavior';
import { MoveViewPortBehavior } from './move-view-port-behavior';
import { OpenFolderBehavior } from './open-folder-behavior';
import { SelectStepBehavior } from './select-step-behavior';

export class ClickBehaviorResolver {
	public constructor(
		private readonly designerContext: DesignerContext,
		private readonly componentContext: ComponentContext,
		private readonly state: DesignerState
	) {}

	public resolve(rootComponent: Component, element: Element, position: Vector, forceMoveMode: boolean): Behavior {
		const click: ClickDetails = {
			element,
			position,
			scale: this.state.viewPort.scale
		};

		const result = !forceMoveMode && !this.state.isMoveModeEnabled ? rootComponent.findByClick(click) : null;
		if (!result) {
			return MoveViewPortBehavior.create(this.state);
		}

		switch (result.action.type) {
			case ClickBehaviorType.selectStep:
				return SelectStepBehavior.create(result.component, this.designerContext, this.componentContext);

			case ClickBehaviorType.openFolder:
				return OpenFolderBehavior.create(this.designerContext, element, result);

			default:
				throw new Error('Not supported behavior type');
		}
	}
}
