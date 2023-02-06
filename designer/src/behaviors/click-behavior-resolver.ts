import { Vector } from '../core';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { ClickBehaviorType, ClickDetails, Component } from '../workspace';
import { Behavior } from './behavior';
import { MoveViewPortBehavior } from './move-view-port-behavior';
import { OpenFolderBehavior } from './open-folder-behavior';
import { SelectStepBehavior } from './select-step-behavior';

export class ClickBehaviorResolver {
	public constructor(private readonly designerContext: DesignerContext, private readonly state: DesignerState) {}

	public resolve(rootComponent: Component, element: Element, position: Vector, forceDisableDrag: boolean): Behavior {
		const click: ClickDetails = {
			element,
			position,
			scale: this.state.viewPort.scale
		};

		const result = rootComponent.findByClick(click);
		if (!result) {
			return MoveViewPortBehavior.create(this.state, true);
		}

		switch (result.action.type) {
			case ClickBehaviorType.selectStep: {
				const isDragDisabled = forceDisableDrag || this.state.isDragDisabled;
				return SelectStepBehavior.create(result.component, isDragDisabled, this.designerContext);
			}

			case ClickBehaviorType.openFolder:
				return OpenFolderBehavior.create(this.designerContext, element, result);

			default:
				throw new Error('Not supported behavior type');
		}
	}
}
