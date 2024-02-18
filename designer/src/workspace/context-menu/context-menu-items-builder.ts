import { Sequence, Step } from '../../definition';
import { ViewportApi } from '../../api/viewport-api';
import { StateModifier } from '../../modifier/state-modifier';
import { ContextMenuItem, ContextMenuItemsProvider } from '../../designer-extension';
import { DesignerState } from '../../designer-state';
import { ClickCommand, ClickCommandType, SelectStepClickCommand } from '../component';

export class ContextMenuItemsBuilder {
	public constructor(
		private readonly viewportApi: ViewportApi,
		private readonly stateModifier: StateModifier,
		private readonly state: DesignerState,
		private readonly customMenuItemsProvider: ContextMenuItemsProvider | undefined
	) {}

	public build(commandOrNull: ClickCommand | null): ContextMenuItem[] {
		const items: ContextMenuItem[] = [];

		if (commandOrNull && commandOrNull.type === ClickCommandType.selectStep) {
			const ssc = commandOrNull as SelectStepClickCommand;
			const step = ssc.component.step;
			const parentSequence = ssc.component.parentSequence;

			items.push({
				label: step.name,
				order: 0
			});
			this.tryAppendCustomItems(items, step, parentSequence);

			if (this.stateModifier.isSelectable(step, parentSequence)) {
				if (this.state.selectedStepId === step.id) {
					items.push({
						label: `Unselect`,
						order: 10,
						callback: () => {
							this.state.setSelectedStepId(null);
						}
					});
				} else {
					items.push({
						label: 'Select',
						order: 20,
						callback: () => {
							this.stateModifier.trySelectStepById(step.id);
						}
					});
				}
			}

			if (!this.state.isReadonly) {
				if (this.stateModifier.isDeletable(step.id)) {
					items.push({
						label: 'Delete',
						order: 30,
						callback: () => {
							this.stateModifier.tryDelete(step.id);
						}
					});
				}
				if (this.stateModifier.isDuplicable(step, parentSequence)) {
					items.push({
						label: 'Duplicate',
						order: 40,
						callback: () => {
							this.stateModifier.tryDuplicate(step, parentSequence);
						}
					});
				}
			}
		} else {
			this.tryAppendCustomItems(items, null, this.state.definition.sequence);
		}

		items.push({
			label: 'Reset view',
			order: 50,
			callback: () => {
				this.viewportApi.resetViewport();
			}
		});

		items.sort((a, b) => a.order - b.order);
		return items;
	}

	private tryAppendCustomItems(items: ContextMenuItem[], step: Step | null, parentSequence: Sequence) {
		if (this.customMenuItemsProvider) {
			const customItems = this.customMenuItemsProvider.getItems(step, parentSequence);
			for (const customItem of customItems) {
				items.push(customItem);
			}
		}
	}
}
