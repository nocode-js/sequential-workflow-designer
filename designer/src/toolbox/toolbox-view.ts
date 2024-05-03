import { ToolboxApi } from '../api/toolbox-api';
import { ToolboxGroupData } from './toolbox-data-provider';
import { Dom } from '../core/dom';
import { Icons } from '../core/icons';
import { ScrollBoxView } from './scrollbox-view';
import { ToolboxItem } from './toolbox-item';
import { I18n } from '../designer-configuration';

export class ToolboxView {
	public static create(parent: HTMLElement, api: ToolboxApi, i18n: I18n): ToolboxView {
		const root = Dom.element('div', {
			class: 'sqd-toolbox'
		});

		const header = Dom.element('div', {
			class: 'sqd-toolbox-header'
		});
		const headerTitle = Dom.element('div', {
			class: 'sqd-toolbox-header-title'
		});
		headerTitle.innerText = i18n('toolbox.title', 'Toolbox');

		const body = Dom.element('div', {
			class: 'sqd-toolbox-body'
		});

		const filterInput = Dom.element('input', {
			class: 'sqd-toolbox-filter',
			type: 'text',
			placeholder: i18n('toolbox.search', 'Search...')
		});

		root.appendChild(header);
		root.appendChild(body);
		header.appendChild(headerTitle);
		body.appendChild(filterInput);
		parent.appendChild(root);

		const scrollBoxView = ScrollBoxView.create(body, parent);
		return new ToolboxView(header, body, filterInput, scrollBoxView, api);
	}

	private headerToggleIcon?: SVGElement;

	private constructor(
		private readonly header: HTMLElement,
		private readonly body: HTMLElement,
		private readonly filterInput: HTMLInputElement,
		private readonly scrollBoxView: ScrollBoxView,
		private readonly api: ToolboxApi
	) {}

	public bindToggleClick(handler: () => void) {
		function forward(e: Event) {
			e.preventDefault();
			handler();
		}
		this.header.addEventListener('click', forward, false);
	}

	public bindFilterInputChange(handler: (value: string) => void) {
		function forward(e: Event) {
			handler((e.target as HTMLInputElement).value);
		}
		this.filterInput.addEventListener('keyup', forward, false);
		this.filterInput.addEventListener('blur', forward, false);
	}

	public setIsCollapsed(isCollapsed: boolean) {
		Dom.toggleClass(this.body, isCollapsed, 'sqd-hidden');

		if (this.headerToggleIcon) {
			this.header.removeChild(this.headerToggleIcon);
		}
		this.headerToggleIcon = Icons.createSvg('sqd-toolbox-toggle-icon', isCollapsed ? Icons.expand : Icons.close);
		this.header.appendChild(this.headerToggleIcon);

		if (!isCollapsed) {
			this.scrollBoxView.refresh();
		}
	}

	public setGroups(groups: ToolboxGroupData[]) {
		const list = Dom.element('div');

		groups.forEach(group => {
			const groupTitle = Dom.element('div', {
				class: 'sqd-toolbox-group-title'
			});
			groupTitle.innerText = group.name;
			list.appendChild(groupTitle);

			group.items.forEach(item => ToolboxItem.create(list, item, this.api));
		});
		this.scrollBoxView.setContent(list);
	}

	public destroy() {
		this.scrollBoxView.destroy();
	}
}
