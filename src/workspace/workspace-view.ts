import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { StartStopComponent } from './start-stop/start-stop-component';

const GRID_SIZE = 48;

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
		canvas.appendChild(
			Dom.svg('rect', {
				width: '100%',
				height: '100%',
				fill: 'url(#sqd-grid)'
			})
		);
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
		private readonly configuration: StepsConfiguration
	) {}

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

	public getClientPosition(): Vector {
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
