import { ControlBar } from './control-bar/control-bar';
import { Dom } from './core/dom';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { LayoutController } from './layout-controller';
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
		let toolbox: Toolbox | undefined = undefined;

		if (!configuration.toolbox.isHidden) {
			toolbox = Toolbox.create(root, context);
		}
		ControlBar.create(root, context);
		if (!configuration.editors.isHidden) {
			SmartEditor.create(root, context);
		}
		const view = new DesignerView(root, context.layoutController, workspace, toolbox);
		view.reloadLayout();
		window.addEventListener('resize', view.onResizeHandler);
		return view;
	}

	private readonly onResizeHandler = () => this.onResize();

	public constructor(
		private readonly root: HTMLElement,
		private readonly layoutController: LayoutController,
		public readonly workspace: Workspace,
		private readonly toolbox?: Toolbox
	) {}

	public destroy() {
		this.workspace.destroy();
		this.toolbox?.destroy();

		this.root.parentElement?.removeChild(this.root);
	}

	private onResize() {
		this.reloadLayout();
	}

	private reloadLayout() {
		const isMobile = this.layoutController.isMobile();
		Dom.toggleClass(this.root, !isMobile, 'sqd-layout-desktop');
		Dom.toggleClass(this.root, isMobile, 'sqd-layout-mobile');
	}
}
