import { Step } from '../definition';
import { BehaviorController } from '../behaviors/behavior-controller';
import { ObjectCloner, SimpleEventListener, Uid, Vector } from '../core';
import { StepDefinition, ToolboxConfiguration, ToolboxGroupConfiguration, UidGenerator } from '../designer-configuration';
import { DesignerState } from '../designer-state';
import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { DesignerContext } from '../designer-context';
import { IconProvider } from '../core/icon-provider';

export class ToolboxApi {
	public constructor(
		private readonly state: DesignerState,
		private readonly designerContext: DesignerContext,
		private readonly behaviorController: BehaviorController,
		private readonly iconProvider: IconProvider,
		private readonly configuration: ToolboxConfiguration | false,
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

	public tryGetIconUrl(step: StepDefinition): string | null {
		return this.iconProvider.getIconUrl(step);
	}

	public getLabel(step: StepDefinition): string {
		const labelProvider = this.getConfiguration().labelProvider;
		return labelProvider ? labelProvider(step) : step.name;
	}

	public filterGroups(filter: string | undefined): ToolboxGroupConfiguration[] {
		return this.getConfiguration()
			.groups.map(group => {
				return {
					name: group.name,
					steps: group.steps.filter(s => {
						return filter ? s.name.toLowerCase().includes(filter) : true;
					})
				};
			})
			.filter(group => group.steps.length > 0);
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

	private getConfiguration(): ToolboxConfiguration {
		if (!this.configuration) {
			throw new Error('Toolbox is disabled');
		}
		return this.configuration;
	}
}
