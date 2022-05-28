import { MoveViewPortBehavior } from '../behaviors/move-view-port-behavior';
import { SelectStepBehavior } from '../behaviors/select-step-behavior';
import { Dom } from '../core/dom';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { Placeholder } from './component';
import { StartStopComponent } from './start-stop-component';

const GRID_SIZE = 48;

export class Workspace {

	public static create(parent: HTMLElement, context: DesignerContext): Workspace {
		const view = WorkspaceView.create(parent, context.configuration.steps);

		const workspace = new Workspace(view, context);
		setTimeout(() => {
			workspace.render();
			workspace.view.refreshSize();
			workspace.center();
		});

		context.onDefinitionChanged.subscribe(() => workspace.render());
		context.onIsMovingChanged.subscribe(i => workspace.setIsMoving(i));
		context.onCenterViewPortRequested.subscribe(() => workspace.center());
		context.setPlaceholdersProvider(() => workspace.getPlaceholders());

		workspace.view.bindResize(() => workspace.view.refreshSize());
		workspace.view.bindMouseDown(e => workspace.onMouseDown(e));
		workspace.view.bindTouchStart(e => workspace.onTouchStart(e));
		workspace.view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	public isValid = false;

	private position = new Vector(0, 0);
	private scale = 1.0;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly context: DesignerContext) {
	}

	public revalidate() {
		this.isValid = this.view.rootComponent?.validate() || false;
	}

	public setPosition(position: Vector) {
		this.position = position;
		this.view.setPositionAndScale(this.position, this.scale);
		this.context.notifiyViewPortChanged();
	}

	private render() {
		this.view.render(this.context.definition.sequence);
		this.revalidate();
	}

	private onMouseDown(e: MouseEvent) {
		e.preventDefault();
		const isMiddleButton = (e.button === 1);
		this.startBehavior(e.target as Element, readMousePosition(e), isMiddleButton);
	}

	private onTouchStart(e: TouchEvent) {
		e.preventDefault();
		const position = readTouchPosition(e);
		const element = document.elementFromPoint(position.x, position.y);
		if (element) {
			this.startBehavior(element, position, false);
		}
	}

	private startBehavior(target: Element, position: Vector, forceMoving: boolean) {
		if (this.view.rootComponent) {
			const clickedStep = !forceMoving && !this.context.isMovingDisabled
				? this.view.rootComponent.findStepComponent(target as Element)
				: null;

			if (clickedStep) {
				this.context.behaviorController.start(position, SelectStepBehavior.create(clickedStep, this.context));
			} else {
				this.context.behaviorController.start(position, MoveViewPortBehavior.create(this.position, this, this.context));
			}
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

	private center() {
		if (this.view.rootComponent) {
			const clientSize = this.view.getClientSize();
			const x = Math.max(0, (clientSize.x - this.view.rootComponent.view.width) / 2);
			const y = Math.max(0, (clientSize.y - this.view.rootComponent.view.height) / 2);

			this.position = new Vector(x, y);
			this.scale = 1;
			this.view.setPositionAndScale(this.position, this.scale);
			this.context.notifiyViewPortChanged();
		}
	}

	private setIsMoving(isMoving: boolean) {
		this.view.rootComponent?.setIsMoving(isMoving);
	}

	private getPlaceholders(): Placeholder[] {
		const result: Placeholder[] = [];
		this.view.rootComponent?.getPlaceholders(result);
		return result;
	}
}

export class WorkspaceView {

	public static create(parent: HTMLElement, configuration: StepsConfiguration): WorkspaceView {
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
		parent.appendChild(workspace);
		return new WorkspaceView(workspace, canvas, gridPattern, gridPatternPath, foreground, configuration);
	}

	public rootComponent?: StartStopComponent;

	private constructor(
		private readonly workspace: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement,
		private readonly configuration: StepsConfiguration) {
	}

	public render(sequence: Sequence) {
		if (this.rootComponent) {
			this.rootComponent.view.destroy();
		}
		this.rootComponent = StartStopComponent.create(this.foreground, sequence, this.configuration);
	}

	public setPositionAndScale(position: Vector, scale: number) {
		const gridSize = GRID_SIZE * scale;
		Dom.attrs(this.gridPattern, {
			x: position.x,
			y: position.y,
			width: gridSize,
			height: gridSize
		});
		Dom.attrs(this.gridPatternPath, {
			d: `M ${gridSize} 0 L 0 0 0 ${gridSize}`
		});
		Dom.attrs(this.foreground, {
			transform: `translate(${position.x}, ${position.y}) scale(${scale})`
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

	public getClientSize(): Vector {
		return new Vector(this.canvas.clientWidth, this.canvas.clientHeight);
	}

	public bindResize(handler: () => void) {
		window.addEventListener('resize', handler);
	}

	public bindMouseDown(handler: (e: MouseEvent) => void) {
		this.canvas.addEventListener('mousedown', handler);
	}

	public bindTouchStart(handler: (e: TouchEvent) => void) {
		this.canvas.addEventListener('touchstart', handler);
	}

	public bindWheel(handler: (e: WheelEvent) => void) {
		this.canvas.addEventListener('wheel', handler);
	}
}
