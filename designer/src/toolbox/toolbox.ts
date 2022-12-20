import { DesignerConfiguration, ToolboxGroupConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { ComponentContext } from '../workspace/component-context';
import { ToolboxView } from './toolbox-view';

export class Toolbox {
	public static create(parent: HTMLElement, designerContext: DesignerContext, componentContext: ComponentContext): Toolbox {
		const view = ToolboxView.create(parent, designerContext, componentContext);
		view.setIsCollapsed(designerContext.state.isToolboxCollapsed);

		const toolbox = new Toolbox(view, designerContext.state, designerContext.configuration);
		toolbox.render();
		designerContext.state.onIsToolboxCollapsedChanged.subscribe(ic => toolbox.onIsToolboxCollapsedChanged(ic));
		view.bindToggleIsCollapsedClick(() => toolbox.toggleIsCollapsedClick());
		view.bindFilterInputChange(v => toolbox.onFilterInputChanged(v));
		return toolbox;
	}

	private filter?: string;

	private constructor(
		private readonly view: ToolboxView,
		private readonly state: DesignerState,
		private readonly configuration: DesignerConfiguration
	) {}

	public destroy() {
		this.view.destroy();
	}

	private render() {
		const groups: ToolboxGroupConfiguration[] = this.configuration.toolbox.groups
			.map(g => {
				return {
					name: g.name,
					steps: g.steps.filter(s => {
						return this.filter ? s.name.toLowerCase().includes(this.filter) : true;
					})
				};
			})
			.filter(g => g.steps.length > 0);
		this.view.setGroups(groups);
	}

	private toggleIsCollapsedClick() {
		this.state.toggleIsToolboxCollapsed();
	}

	private onIsToolboxCollapsedChanged(isCollapsed: boolean) {
		this.view.setIsCollapsed(isCollapsed);
	}

	private onFilterInputChanged(value: string) {
		this.filter = value.toLowerCase();
		this.render();
	}
}
