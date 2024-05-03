import { Sequence, Step } from '../../definition';
import { ViewportApi } from '../../api/viewport-api';
import { StateModifier } from '../../modifier/state-modifier';
import { ContextMenuItem, ContextMenuItemsProvider } from '../../designer-extension';
import { DesignerState } from '../../designer-state';
import { ClickCommand, ClickCommandType, SelectStepClickCommand } from '../component';
import { I18n } from '../../designer-configuration';

export class ContextMenuItemsBuilder {
	public constructor(
		private readonly viewportApi: ViewportApi,
		private readonly i18n: I18n,
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

			const name = this.i18n(`step.${step.type}.name`, step.name);
			items.push({
				label: name,
				order: 0
			});
			this.tryAppendCustomItems(items, step, parentSequence);

			if (this.stateModifier.isSelectable(step, parentSequence)) {
				if (this.state.selectedStepId === step.id) {
					items.push({
						label: this.i18n('contextMenu.unselect', 'Unselect'),
						order: 10,
						callback: () => {
							this.state.setSelectedStepId(null);
						}
					});
				} else {
					items.push({
						label: this.i18n('contextMenu.select', 'Select'),
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
						label: this.i18n('contextMenu.delete', 'Delete'),
						order: 30,
						callback: () => {
							this.stateModifier.tryDelete(step.id);
						}
					});
				}
				if (this.stateModifier.isDuplicable(step, parentSequence)) {
					items.push({
						label: this.i18n('contextMenu.duplicate', 'Duplicate'),
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
			label: this.i18n('contextMenu.resetView', 'Reset view'),
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
