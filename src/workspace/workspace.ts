import { MoveViewPortBehavior } from '../behaviors/move-view-port-behavior';
import { SelectStepBehavior } from '../behaviors/select-step-behavior';
import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { Component, ComponentView, Placeholder } from './component';
import { StartStopComponent } from './start-stop-component';

const GRID_SIZE = 48;

export class Workspace {

	public static append(parent: HTMLElement, context: DesignerContext): Workspace {
		const view = WorkspaceView.create(parent);

		const workspace = new Workspace(view, context);
		workspace.view.refreshSize();
		workspace.render();
		workspace.center();

		context.onDefinitionChanged.subscribe(() => workspace.render());
		context.onIsMovingChanged.subscribe(i => workspace.setIsMoving(i));
		context.onCenterViewPortRequested.subscribe(() => workspace.center());
		context.setPlaceholdersProvider(() => workspace.getPlaceholders());

		workspace.view.bindResize(() => workspace.view.refreshSize());
		workspace.view.bindMouseDown(e => workspace.onMouseDown(e));
		workspace.view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	private rootComponent?: Component;
	private position = new Vector(0, 0);
	private scale = 1.0;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly context: DesignerContext) {
	}

	private render() {
		this.rootComponent = StartStopComponent.create(this.context.definition.sequence, this.context.configuration);
		this.view.setView(this.rootComponent.view);
	}

	private onMouseDown(e: MouseEvent) {
		if (!this.rootComponent) {
			return;
		}
		const isNotScrollClick = (e.button !== 1);
		const clickedStep = isNotScrollClick && !this.context.isMovingDisabled
			? this.rootComponent.findStepComponent(e.target as Element)
			: null;

		if (clickedStep) {
			this.context.behaviorController.start(e, SelectStepBehavior.create(clickedStep, this.context));
		} else {
			this.context.behaviorController.start(e, MoveViewPortBehavior.create(this.position, this, this.context));
		}
	}

	private onWheel(e: WheelEvent) {
		const mousePoint = new Vector(e.pageX, e.pageY).subtract(this.view.getPosition());
		// The real point is point on canvas with no scale.
		const mouseRealPoint = mousePoint.divideByScalar(this.scale).subtract(this.position.divideByScalar(this.scale));

		const wheelDelta = (e.deltaY > 0 ? -0.1 : 0.1);
		const newScale = Math.min(Math.max(this.scale + wheelDelta, 0.1), 3);

		this.position = mouseRealPoint.multiplyByScalar(-newScale).add(mousePoint);
		this.scale = newScale;

		this.view.setPositionAndScale(this.position, this.scale);
		this.context.notifiyViewPortChanged();
	}

	public setPosition(position: Vector) {
		this.position = position;
		this.view.setPositionAndScale(this.position, this.scale);
		this.context.notifiyViewPortChanged();
	}

	private center() {
		if (this.rootComponent) {
			const size = this.view.getSize();
			const x = Math.max(0, (size.x - this.rootComponent.view.width) / 2);
			const y = Math.max(0, (size.y - this.rootComponent.view.height) / 2);

			this.position = new Vector(x, y);
			this.scale = 1;
			this.view.setPositionAndScale(this.position, this.scale);
			this.context.notifiyViewPortChanged();
		}
	}

	private setIsMoving(isMoving: boolean) {
		this.rootComponent?.setIsMoving(isMoving);
	}

	private getPlaceholders(): Placeholder[] {
		const result: Placeholder[] = [];
		this.rootComponent?.getPlaceholders(result);
		return result;
	}
}

export class WorkspaceView {

	public static create(root: HTMLElement): WorkspaceView {
		const defs = Dom.svg('defs');
		const gridPattern = Dom.svg('pattern', {
			id: 'sqd-grid',
			patternUnits: 'userSpaceOnUse'
		});
		const gridPatternPath = Dom.svg('path', {
			class: 'sqd-grid-path',
			fill: 'none'
		});

		defs.appendChild(gridPattern);
		gridPattern.appendChild(gridPatternPath);

		const foreground = Dom.svg('g');

		const workspace = Dom.element('div', {
			class: 'sqd-workspace'
		});
		const canvas = Dom.svg('svg', {
			class: 'sqd-workspace-canvas'
		});
		canvas.appendChild(defs);
		canvas.appendChild(Dom.svg('rect', {
			width: '100%',
			height: '100%',
			fill: 'url(#sqd-grid)'
		}));
		canvas.appendChild(foreground);
		workspace.appendChild(canvas);
		root.appendChild(workspace);
		return new WorkspaceView(workspace, canvas, gridPattern, gridPatternPath, foreground);
	}

	private view?: ComponentView;

	private constructor(
		private readonly workspace: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement) {
	}

	public setView(view: ComponentView) {
		if (this.view) {
			this.foreground.removeChild(this.view.g);
		}
		this.foreground.appendChild(view.g);
		this.view = view;
	}

	public setPositionAndScale(p: Vector, scale: number) {
		const size = GRID_SIZE * scale;
		Dom.attrs(this.gridPattern, {
			x: p.x,
			y: p.y,
			width: size,
			height: size
		});
		Dom.attrs(this.gridPatternPath, {
			d: `M ${size} 0 L 0 0 0 ${size}`
		});
		Dom.attrs(this.foreground, {
			transform: `translate(${p.x}, ${p.y}) scale(${scale})`
		});
	}

	public refreshSize() {
		Dom.attrs(this.canvas, {
			width: this.workspace.offsetWidth,
			height: this.workspace.offsetHeight
		});
	}

	public getPosition(): Vector {
		const rect = this.canvas.getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public getSize(): Vector {
		return new Vector(this.canvas.clientWidth, this.canvas.clientHeight);
	}

	public bindResize(handler: () => void) {
		window.addEventListener('resize', handler);
	}

	public bindMouseDown(handler: (e: MouseEvent) => void) {
		this.canvas.addEventListener('mousedown', handler);
	}

	public bindWheel(handler: (e: WheelEvent) => void) {
		this.canvas.addEventListener('wheel', handler);
	}
}
