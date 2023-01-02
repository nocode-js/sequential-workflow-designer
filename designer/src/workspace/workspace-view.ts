import { Dom } from '../core/dom';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { ComponentContext } from './component-context';
import { SequencePlaceIndicator, StartStopComponent } from './start-stop/start-stop-component';

const GRID_SIZE = 48;

let lastGridPatternId = 0;

export class WorkspaceView {
	public static create(parent: HTMLElement, context: ComponentContext): WorkspaceView {
		const defs = Dom.svg('defs');
		const gridPatternId = 'sqd-grid-pattern-' + lastGridPatternId++;
		const gridPattern = Dom.svg('pattern', {
			id: gridPatternId,
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
		canvas.appendChild(
			Dom.svg('rect', {
				width: '100%',
				height: '100%',
				fill: `url(#${gridPatternId})`
			})
		);
		canvas.appendChild(foreground);
		workspace.appendChild(canvas);
		parent.appendChild(workspace);

		const view = new WorkspaceView(workspace, canvas, gridPattern, gridPatternPath, foreground, context);
		window.addEventListener('resize', view.onResizeHandler, false);
		return view;
	}

	private onResizeHandler = () => this.onResize();
	public rootComponent?: StartStopComponent;

	private constructor(
		private readonly workspace: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement,
		private readonly context: ComponentContext
	) {}

	public render(sequence: Sequence, parentSequencePlaceIndicator: SequencePlaceIndicator | null) {
		if (this.rootComponent) {
			this.rootComponent.destroy();
		}
		this.rootComponent = StartStopComponent.create(this.foreground, sequence, parentSequencePlaceIndicator, this.context);
		this.refreshSize();
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

	public getClientPosition(): Vector {
		const rect = this.canvas.getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public getClientCanvasSize(): Vector {
		return new Vector(this.canvas.clientWidth, this.canvas.clientHeight);
	}

	public bindClick(handler: (position: Vector, target: Element, buttonIndex: number) => void) {
		this.canvas.addEventListener(
			'mousedown',
			e => {
				handler(readMousePosition(e), e.target as Element, e.button);
			},
			false
		);

		this.canvas.addEventListener(
			'touchstart',
			e => {
				e.preventDefault();
				const position = readTouchPosition(e);
				const element = document.elementFromPoint(position.x, position.y);
				if (element) {
					handler(position, element, 0);
				}
			},
			false
		);
	}

	public bindContextMenu(handler: (e: MouseEvent) => void) {
		this.canvas.addEventListener('contextmenu', handler, false);
	}

	public bindWheel(handler: (e: WheelEvent) => void) {
		this.canvas.addEventListener('wheel', handler, false);
	}

	public destroy() {
		window.removeEventListener('resize', this.onResizeHandler, false);
	}

	public refreshSize() {
		Dom.attrs(this.canvas, {
			width: this.workspace.offsetWidth,
			height: this.workspace.offsetHeight
		});
	}

	private onResize() {
		this.refreshSize();
	}
}
