import { Vector } from '../../core';
import { DesignerConfiguration } from '../../designer-configuration';
import { ClickCommand } from '../component';
import { ContextMenu } from './context-menu';
import { ContextMenuItemsBuilder } from './context-menu-items-builder';

export class ContextMenuController {
	private current?: ContextMenu;

	public constructor(
		private readonly theme: string,
		private readonly configuration: DesignerConfiguration,
		private readonly itemsBuilder: ContextMenuItemsBuilder
	) {}

	public tryOpen(position: Vector, commandOrNull: ClickCommand | null) {
		if (this.configuration.contextMenu === false) {
			// Context menu is disabled.
			return;
		}

		if (this.current) {
			this.current.tryDestroy();
		}

		const items = this.itemsBuilder.build(commandOrNull);
		this.current = ContextMenu.create(position, this.theme, items);
	}

	public destroy() {
		if (this.current) {
			this.current.tryDestroy();
		}
	}
}
