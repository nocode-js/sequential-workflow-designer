import { ToolboxApi } from '../api';
import { ToolboxGroupData } from './toolbox-data-provider';
import { UiComponent } from '../designer-extension';
import { ToolboxView } from './toolbox-view';

export class Toolbox implements UiComponent {
	public static create(root: HTMLElement, api: ToolboxApi): Toolbox {
		const allGroups = api.getAllGroups();

		const view = ToolboxView.create(root, api);

		const toolbox = new Toolbox(view, api, allGroups);
		toolbox.render();
		toolbox.onIsCollapsedChanged();
		view.bindToggleClick(() => toolbox.onToggleClicked());
		view.bindFilterInputChange(v => toolbox.onFilterInputChanged(v));
		api.subscribeIsCollapsed(() => toolbox.onIsCollapsedChanged());
		return toolbox;
	}

	private filter?: string;

	private constructor(
		private readonly view: ToolboxView,
		private readonly api: ToolboxApi,
		private readonly allGroups: ToolboxGroupData[]
	) {}

	public destroy() {
		this.view.destroy();
	}

	private render() {
		const groups = this.api.applyFilter(this.allGroups, this.filter);
		this.view.setGroups(groups);
	}

	private onIsCollapsedChanged() {
		this.view.setIsCollapsed(this.api.isCollapsed());
	}

	private onToggleClicked() {
		this.api.toggleIsCollapsed();
	}

	private onFilterInputChanged(value: string) {
		this.filter = value;
		this.render();
	}
}
