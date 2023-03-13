import { DesignerApi } from '../api/designer-api';
import { ToolboxConfiguration, ToolboxGroupConfiguration } from '../designer-configuration';
import { UiComponent } from '../designer-extension';
import { ToolboxView } from './toolbox-view';

export class Toolbox implements UiComponent {
	public static create(root: HTMLElement, api: DesignerApi, configuration: ToolboxConfiguration): Toolbox {
		const view = ToolboxView.create(root, api.toolbox);

		const toolbox = new Toolbox(view, configuration);
		toolbox.render();
		toolbox.setIsCollapsed(api.toolbox.isVisibleAtStart());
		view.bindToggleIsCollapsedClick(() => toolbox.toggleIsCollapsedClick());
		view.bindFilterInputChange(v => toolbox.onFilterInputChanged(v));
		return toolbox;
	}

	private isCollapsed?: boolean;
	private filter?: string;

	private constructor(private readonly view: ToolboxView, private readonly configuration: ToolboxConfiguration) {}

	public destroy() {
		this.view.destroy();
	}

	private render() {
		const groups: ToolboxGroupConfiguration[] = this.configuration.groups
			.map(group => {
				return {
					name: group.name,
					steps: group.steps.filter(s => {
						return this.filter ? s.name.toLowerCase().includes(this.filter) : true;
					})
				};
			})
			.filter(group => group.steps.length > 0);
		this.view.setGroups(groups);
	}

	private setIsCollapsed(isCollapsed: boolean) {
		this.isCollapsed = isCollapsed;
		this.view.setIsCollapsed(isCollapsed);
	}

	private toggleIsCollapsedClick() {
		this.setIsCollapsed(!this.isCollapsed);
	}

	private onFilterInputChanged(value: string) {
		this.filter = value.toLowerCase();
		this.render();
	}
}
