import { Vector } from '../core';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { ClickCommandType, ClickDetails, Component } from '../workspace';
import { Behavior } from './behavior';
import { MoveViewportBehavior } from './move-viewport-behavior';
import { TriggerCustomActionBehavior } from './trigger-custom-action-behavior';
import { SelectStepBehavior } from './select-step-behavior';
import { OpenFolderBehavior } from './open-folder-behavior';

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
			case ClickCommandType.selectStep: {
				const isDragDisabled =
					forceDisableDrag ||
					this.state.isDragDisabled ||
					!this.designerContext.definitionModifier.isDraggable(command.component.step, command.component.parentSequence);
				return SelectStepBehavior.create(command.component, isDragDisabled, this.designerContext);
			}

			case ClickCommandType.openFolder:
				return OpenFolderBehavior.create(this.designerContext, element, command);

			case ClickCommandType.triggerCustomAction:
				return TriggerCustomActionBehavior.create(this.designerContext, element, command);

			default:
				throw new Error('Not supported behavior type');
		}
	}
}
