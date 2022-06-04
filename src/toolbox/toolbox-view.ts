import { Dom } from '../core/dom';
import { ToolboxGroupConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ToolboxItem } from './toolbox-item';

export class ToolboxView {
	public static create(parent: HTMLElement, context: DesignerContext): ToolboxView {
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
		return new ToolboxView(filterInput, container, context);
	}

	private constructor(
		private readonly filterInput: HTMLInputElement,
		private readonly container: HTMLElement,
		private readonly context: DesignerContext
	) {}

	public bindFilterInputChange(handler: (e: Event) => void) {
		this.filterInput.addEventListener('keyup', handler);
		this.filterInput.addEventListener('blur', handler);
	}

	public setGroups(groups: ToolboxGroupConfiguration[]) {
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
}
