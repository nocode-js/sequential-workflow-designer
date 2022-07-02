import { Dom } from '../core/dom';
import { Icons } from '../core/icons';
import { ToolboxGroupConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ScrollBoxView } from './scrollbox-view';
import { ToolboxItem } from './toolbox-item';

export class ToolboxView {
	public static create(parent: HTMLElement, context: DesignerContext): ToolboxView {
		const root = Dom.element('div', {
			class: 'sqd-toolbox'
		});

		const header = Dom.element('div', {
			class: 'sqd-toolbox-header'
		});
		const headerTitle = Dom.element('div', {
			class: 'sqd-toolbox-header-title'
		});
		headerTitle.innerText = 'Toolbox';

		const headerToggleIcon = Icons.create('sqd-toolbox-toggle-icon');

		const body = Dom.element('div', {
			class: 'sqd-toolbox-body'
		});

		const filterInput = Dom.element('input', {
			class: 'sqd-toolbox-filter',
			type: 'text',
			placeholder: 'Search...'
		});

		root.appendChild(header);
		root.appendChild(body);
		header.appendChild(headerTitle);
		header.appendChild(headerToggleIcon);
		body.appendChild(filterInput);
		parent.appendChild(root);

		const scrollboxView = ScrollBoxView.create(body, parent);
		return new ToolboxView(header, headerToggleIcon, body, filterInput, scrollboxView, context);
	}

	private constructor(
		private readonly header: HTMLElement,
		private readonly headerToggleIcon: SVGElement,
		private readonly body: HTMLElement,
		private readonly filterInput: HTMLInputElement,
		private readonly scrollboxView: ScrollBoxView,
		private readonly context: DesignerContext
	) {}

	public bindToggleIsCollapsedClick(handler: () => void) {
		this.header.addEventListener('click', e => {
			e.preventDefault();
			handler();
		});
	}

	public bindFilterInputChange(handler: (value: string) => void) {
		function forward(e: Event) {
			handler((e.target as HTMLInputElement).value);
		}
		this.filterInput.addEventListener('keyup', forward);
		this.filterInput.addEventListener('blur', forward);
	}

	public setIsCollapsed(isCollapsed: boolean) {
		Dom.toggleClass(this.body, isCollapsed, 'sqd-hidden');
		this.headerToggleIcon.innerHTML = isCollapsed ? Icons.arrowDown : Icons.close;
		if (!isCollapsed) {
			this.scrollboxView.refresh();
		}
	}

	public setGroups(groups: ToolboxGroupConfiguration[]) {
		const list = Dom.element('div');

		groups.forEach(group => {
			const groupTitle = Dom.element('div', {
				class: 'sqd-toolbox-group-title'
			});
			groupTitle.innerText = group.name;
			list.appendChild(groupTitle);

			group.steps.forEach(s => ToolboxItem.create(list, s, this.context));
		});
		this.scrollboxView.setContent(list);
	}

	public destroy() {
		this.scrollboxView.destroy();
	}
}
