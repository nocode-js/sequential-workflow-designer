import { ViewportApi } from '../../api/viewport-api';
import { DefinitionModifier } from '../../definition-modifier';
import { DesignerState } from '../../designer-state';
import { ClickCommand, ClickCommandType, SelectStepClickCommand } from '../component';
import { ContextMenuItems } from './context-menu';

export class ContextMenuItemsBuilder {
	public static build(
		commandOrNull: ClickCommand | null,
		viewportApi: ViewportApi,
		definitionModifier: DefinitionModifier,
		state: DesignerState
	): ContextMenuItems {
		const items: ContextMenuItems = [];

		if (commandOrNull && commandOrNull.type === ClickCommandType.selectStep) {
			const ssc = commandOrNull as SelectStepClickCommand;
			const step = ssc.component.step;
			const parentSequence = ssc.component.parentSequence;

			items.push(step.name);

			if (state.selectedStepId === step.id) {
				items.push({
					label: `Unselect`,
					callback: () => {
						state.setSelectedStepId(null);
					}
				});
			} else {
				items.push({
					label: 'Select',
					callback: () => {
						state.setSelectedStepId(step.id);
					}
				});
			}

			if (!state.isReadonly) {
				if (definitionModifier.isDeletable(step.id)) {
					items.push({
						label: 'Delete',
						callback: () => {
							definitionModifier.tryDelete(step.id);
						}
					});
				}
				if (definitionModifier.isDuplicable(step, parentSequence)) {
					items.push({
						label: 'Duplicate',
						callback: () => {
							definitionModifier.tryDuplicate(step, parentSequence);
						}
					});
				}
			}
		}

		items.push({
			label: 'Reset view',
			callback: () => {
				viewportApi.resetViewport();
			}
		});
		return items;
	}
}
