import { Step } from '../definition';
import { BehaviorController } from '../behaviors/behavior-controller';
import { ObjectCloner, SimpleEventListener, Uid, Vector } from '../core';
import { StepDefinition, UidGenerator } from '../designer-configuration';
import { DesignerState } from '../designer-state';
import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { DesignerContext } from '../designer-context';
import { ToolboxDataProvider, ToolboxGroupData } from '../toolbox/toolbox-data-provider';

export class ToolboxApi {
	public constructor(
		private readonly state: DesignerState,
		private readonly designerContext: DesignerContext,
		private readonly behaviorController: BehaviorController,
		private readonly toolboxDataProvider: ToolboxDataProvider,
		private readonly uidGenerator: UidGenerator | undefined
	) {}

	public isCollapsed(): boolean {
		return this.state.isToolboxCollapsed;
	}

	public toggleIsCollapsed() {
		this.state.setIsToolboxCollapsed(!this.state.isToolboxCollapsed);
	}

	public subscribeIsCollapsed(listener: SimpleEventListener<boolean>) {
		this.state.onIsToolboxCollapsedChanged.subscribe(listener);
	}

	public getAllGroups(): ToolboxGroupData[] {
		return this.toolboxDataProvider.getAllGroups();
	}

	public applyFilter(allGroups: ToolboxGroupData[], filter: string | undefined): ToolboxGroupData[] {
		return this.toolboxDataProvider.applyFilter(allGroups, filter);
	}

	/**
	 * @param position Mouse or touch position.
	 * @param step Step definition.
	 * @returns If started dragging returns true, otherwise returns false.
	 */
	public tryDrag(position: Vector, step: StepDefinition): boolean {
		if (!this.state.isReadonly) {
			const newStep = this.activateStep(step);
			this.behaviorController.start(position, DragStepBehavior.create(this.designerContext, newStep));
			return true;
		}
		return false;
	}

	private activateStep(step: StepDefinition): Step {
		const newStep = ObjectCloner.deepClone(step) as Step;
		newStep.id = this.uidGenerator ? this.uidGenerator() : Uid.next();
		return newStep;
	}
}
