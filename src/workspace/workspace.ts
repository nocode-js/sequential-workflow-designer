import { MoveViewPortBehavior } from '../behaviors/move-view-port-behavior';
import { SelectStepBehavior } from '../behaviors/select-step-behavior';
import { SimpleEvent } from '../core/simple-event';
import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { ComponentView, Placeholder } from './component';
import { StartStopComponent } from './start-stop-component';

const GRID_SIZE = 50;

export class Workspace {

	public static append(parent: HTMLElement, context: DesignerContext): Workspace {
		const view = WorkspaceView.create(parent);

		const workspace = new Workspace(view, context);
		workspace.view.refreshSize();
		workspace.render();
		workspace.center();

		context.onDefinitionChanged.subscribe(() => workspace.render());
		context.onIsDropModeEnabledChanged.subscribe(i => workspace.setIsDropModeEnabled(i));
		context.onCenterViewPortRequested.subscribe(() => workspace.center());
		context.setPlaceholdersProvider(() => workspace.getPlaceholders());

		workspace.view.bindResize(() => workspace.view.refreshSize());
		workspace.view.bindMouseDown(e => workspace.onMouseDown(e));
		workspace.view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	private mainComponent?: StartStopComponent;
	private position = new Vector(0, 0);
	private scale = 1.0;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly context: DesignerContext) {
	}

	private render() {
		this.mainComponent = StartStopComponent.create(this.context.definition.sequence);
		this.view.setView(this.mainComponent.view);
	}

	private onMouseDown(e: MouseEvent) {
		if (!this.mainComponent) {
			return;
		}
		const isNotScrollClick = (e.button !== 1);
		const clickedStep = isNotScrollClick && !this.context.isMovingDisabled
			? this.mainComponent.findStepComponent(e.target as Element)
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
		if (this.mainComponent) {
			const size = this.view.getSize();
			const x = Math.max(0, (size.x - this.mainComponent.view.width) / 2);
			const y = Math.max(0, (size.y - this.mainComponent.view.height) / 2);

			this.position = new Vector(x, y);
			this.scale = 1;
			this.view.setPositionAndScale(this.position, this.scale);
			this.context.notifiyViewPortChanged();
		}
	}

	private setIsDropModeEnabled(isEnabled: boolean) {
		this.mainComponent?.setIsDropModeEnabled(isEnabled);
	}

	private getPlaceholders(): Placeholder[] {
		const result: Placeholder[] = [];
		this.mainComponent?.getPlaceholders(result);
		return result;
	}
}

export class WorkspaceView {

	public static create(root: HTMLElement): WorkspaceView {
		const defs = Svg.element('defs');
		const gridPattern = Svg.element('pattern', {
			id: 'sqd-grid',
			patternUnits: 'userSpaceOnUse'
		});
		const gridPatternPath = Svg.element('path', {
			class: 'sqd-grid-path',
			fill: 'none'
		});

		defs.appendChild(gridPattern);
		gridPattern.appendChild(gridPatternPath);

		const foreground = Svg.element('g');

		const workspace = document.createElement('div');
		workspace.className = 'sqd-workspace';

		const canvas = Svg.element('svg', {
			class: 'sqd-workspace-canvas'
		});
		canvas.appendChild(defs);
		canvas.appendChild(Svg.element('rect', {
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
		Svg.attrs(this.gridPattern, {
			x: p.x,
			y: p.y,
			width: size,
			height: size
		});
		Svg.attrs(this.gridPatternPath, {
			d: `M ${size} 0 L 0 0 0 ${size}`
		});
		Svg.attrs(this.foreground, {
			transform: `translate(${p.x}, ${p.y}) scale(${scale})`
		});
	}

	public refreshSize() {
		Svg.attrs(this.canvas, {
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
