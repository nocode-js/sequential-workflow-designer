import { Dom } from '../core/dom';
import { ToolboxGroupConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ToolboxItem } from './toolbox-item';

export class Toolbox {

	public static create(parent: HTMLElement, context: DesignerContext): Toolbox {
		const root = Dom.element('div', {
			class: 'sqd-toolbox'
		});

		const header = Dom.element('div', {
			class: 'sqd-toolbox-header'
		});
		const title = Dom.element('div', {
			class: 'sqd-toolbox-title'
		});
		title.innerText = 'Steps';
		const filterInput = Dom.element('input', {
			class: 'sqd-toolbox-filter',
			type: 'text',
			placeholder: 'Search...'
		});
		const container = Dom.element('div', {
			class: 'sqd-toolbox-container'
		});

		header.appendChild(title);
		header.appendChild(filterInput);
		root.appendChild(header);
		root.appendChild(container);
		parent.appendChild(root);

		const toolbox = new Toolbox(context, filterInput, container);
		toolbox.render();
		filterInput.addEventListener('keyup', () => toolbox.onFilterInputChanged());
		filterInput.addEventListener('blur', () => toolbox.onFilterInputChanged());
		return toolbox;
	}

	private filter?: string;

	public constructor(
		private readonly context: DesignerContext,
		private readonly filterInput: HTMLInputElement,
		private readonly container: HTMLElement) {
	}

	private render() {
		const groups: ToolboxGroupConfiguration[] = this.context.configuration.toolbox.groups.map(g => {
			return {
				name: g.name,
				steps: g.steps.filter(s => {
					return this.filter
						? s.name.toLocaleLowerCase().includes(this.filter)
						: true;
				})
			};
		}).filter(g => g.steps.length > 0);

		this.container.innerHTML = '';
		groups.forEach(group => {
			const groupTitle = Dom.element('div', {
				class: 'sqd-toolbox-group-title'
			});
			groupTitle.innerText = group.name;
			this.container.appendChild(groupTitle);

			group.steps.forEach(s => ToolboxItem.create(this.container, s, this.context));
		});
	}

	private onFilterInputChanged() {
		this.filter = this.filterInput.value?.toLocaleLowerCase();
		this.render();
	}
}
