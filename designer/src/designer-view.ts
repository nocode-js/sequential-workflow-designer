import { DesignerApi } from './api/designer-api';
import { Dom } from './core/dom';
import { DesignerContext } from './designer-context';
import { Daemon, UiComponent } from './designer-extension';
import { LayoutController } from './layout-controller';
import { Workspace } from './workspace/workspace';

export class DesignerView {
	public static create(parent: HTMLElement, designerContext: DesignerContext, api: DesignerApi): DesignerView {
		const root = Dom.element('div', {
			class: `sqd-designer sqd-theme-${designerContext.theme}`
		});
		parent.appendChild(root);

		const workspace = Workspace.create(root, designerContext, api);

		const uiComponents = designerContext.services.uiComponents.map(factory => factory.create(root, api));
		const daemons = designerContext.services.daemons.map(factory => factory.create(api));

		const view = new DesignerView(root, designerContext.layoutController, workspace, uiComponents, daemons);
		view.reloadLayout();
		window.addEventListener('resize', view.onResizeHandler, false);
		return view;
	}

	private readonly onResizeHandler = () => this.onResize();

	public constructor(
		private readonly root: HTMLElement,
		private readonly layoutController: LayoutController,
		public readonly workspace: Workspace,
		private readonly uiComponents: UiComponent[],
		private readonly daemons: Daemon[]
	) {}

	public destroy() {
		window.removeEventListener('resize', this.onResizeHandler, false);

		this.workspace.destroy();
		this.uiComponents.forEach(component => component.destroy());
		this.daemons.forEach(daemon => daemon.destroy());

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

export type KeyUpHandler = (e: KeyboardEvent) => void;
