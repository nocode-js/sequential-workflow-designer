import { ToolboxGroupConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ToolboxView } from './toolbox-view';

export class Toolbox {
	public static create(parent: HTMLElement, context: DesignerContext): Toolbox {
		const view = ToolboxView.create(parent, context);
		const toolbox = new Toolbox(view, context);
		toolbox.render();
		view.bindFilterInputChange(e => toolbox.onFilterInputChanged(e));
		return toolbox;
	}

	private filter?: string;

	private constructor(private readonly view: ToolboxView, private readonly context: DesignerContext) {}

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

	private onFilterInputChanged(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		this.filter = value.toLowerCase();
		this.render();
	}
}
