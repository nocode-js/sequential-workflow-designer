import { ToolboxGroupConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ToolboxView } from './toolbox-view';

export class Toolbox {
	public static create(parent: HTMLElement, context: DesignerContext): Toolbox {
		const view = ToolboxView.create(parent, context);
		view.setIsCollapsed(context.isToolboxCollapsed);

		const toolbox = new Toolbox(view, context);
		toolbox.render();
		context.onIsToolboxCollapsedChanged.subscribe(ic => toolbox.onIsToolboxCollapsedChanged(ic));
		view.bindToggleIsCollapsedClick(() => toolbox.toggleIsCollapsedClick());
		view.bindFilterInputChange(v => toolbox.onFilterInputChanged(v));
		return toolbox;
	}

	private filter?: string;

	private constructor(private readonly view: ToolboxView, private readonly context: DesignerContext) {}

	public destroy() {
		this.view.destroy();
	}

	private render() {
		const groups: ToolboxGroupConfiguration[] = this.context.configuration.toolbox.groups
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
		this.context.toggleIsToolboxCollapsed();
	}

	private onIsToolboxCollapsedChanged(isCollapsed: boolean) {
		this.view.setIsCollapsed(isCollapsed);
	}

	private onFilterInputChanged(value: string) {
		this.filter = value.toLowerCase();
		this.render();
	}
}
