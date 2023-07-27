import { ViewportApi } from '../../api/viewport-api';
import { Vector } from '../../core';
import { DefinitionModifier } from '../../definition-modifier';
import { DesignerConfiguration } from '../../designer-configuration';
import { DesignerState } from '../../designer-state';
import { ClickCommand } from '../component';
import { ContextMenu } from './context-menu';
import { ContextMenuItemsBuilder } from './context-menu-items-builder';

export class ContextMenuController {
	private last?: ContextMenu;

	public constructor(
		private readonly theme: string,
		private readonly viewportApi: ViewportApi,
		private readonly definitionModifier: DefinitionModifier,
		private readonly state: DesignerState,
		private readonly configuration: DesignerConfiguration
	) {}

	public tryOpen(position: Vector, commandOrNull: ClickCommand | null) {
		if (this.configuration.contextMenu === false) {
			// Context menu is disabled.
			return;
		}

		if (this.last) {
			this.last.tryDestroy();
		}

		const items = ContextMenuItemsBuilder.build(commandOrNull, this.viewportApi, this.definitionModifier, this.state);
		this.last = ContextMenu.create(position, this.theme, items);
	}

	public destroy() {
		if (this.last) {
			this.last.tryDestroy();
		}
	}
}
