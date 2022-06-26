import { ControlBar } from './control-bar/control-bar';
import { Dom } from './core/dom';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { SmartEditor } from './smart-editor/smart-editor';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class DesignerView {
	public static create(parent: HTMLElement, context: DesignerContext, configuration: DesignerConfiguration): DesignerView {
		const theme = configuration.theme || 'light';

		const root = Dom.element('div', {
			class: `sqd-designer sqd-theme-${theme}`
		});
		parent.appendChild(root);

		const workspace = Workspace.create(root, context);
		if (!configuration.toolbox.isHidden) {
			Toolbox.create(root, context);
		}
		ControlBar.create(root, context);
		if (!configuration.editors.isHidden) {
			SmartEditor.create(root, context);
		}
		const view = new DesignerView(root, workspace);
		view.reloadMobileMode();
		window.addEventListener('resize', view.onResizeHandler);
		return view;
	}

	private onResizeHandler = () => this.onResize();

	public constructor(private readonly root: HTMLElement, public readonly workspace: Workspace) {}

	public destroy() {
		this.workspace.destroy();

		window.removeEventListener('resize', this.onResizeHandler);
		this.root.parentElement?.removeChild(this.root);
	}

	private onResize() {
		this.reloadMobileMode();
	}

	private reloadMobileMode() {
		const isMobile = window.innerWidth < 500; // TODO
		Dom.toggleClass(this.root, isMobile, 'sqd-mobile');
	}
}
