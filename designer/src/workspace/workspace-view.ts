import { Dom } from '../core/dom';
import { readMousePosition, readTouchClientPosition, readTouchPosition } from '../core/event-readers';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { Grid, SequencePlaceIndicator } from '../designer-extension';
import { ComponentContext } from '../component-context';
import { Component } from './component';

let lastGridPatternId = 0;

const listenerOptions: AddEventListenerOptions & EventListenerOptions = {
	passive: false
};

export class WorkspaceView {
	public static create(parent: HTMLElement, componentContext: ComponentContext): WorkspaceView {
		const patternId = 'sqd-grid-pattern-' + lastGridPatternId++;
		const pattern = Dom.svg('pattern', {
			id: patternId,
			patternUnits: 'userSpaceOnUse'
		});
		const gridPattern = componentContext.services.grid.create();

		const defs = Dom.svg('defs');
		pattern.appendChild(gridPattern.element);
		defs.appendChild(pattern);

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
				fill: `url(#${patternId})`
			})
		);
		canvas.appendChild(foreground);
		workspace.appendChild(canvas);
		parent.appendChild(workspace);

		const view = new WorkspaceView(workspace, canvas, pattern, gridPattern, foreground, componentContext);
		window.addEventListener('resize', view.onResizeHandler, false);
		return view;
	}

	private onResizeHandler = () => this.onResize();
	public rootComponent?: Component;

	private constructor(
		private readonly workspace: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly pattern: SVGPatternElement,
		private readonly gridPattern: Grid,
		private readonly foreground: SVGGElement,
		private readonly context: ComponentContext
	) {}

	public render(sequence: Sequence, parentSequencePlaceIndicator: SequencePlaceIndicator | null) {
		if (this.rootComponent) {
			this.foreground.removeChild(this.rootComponent.view.g);
		}
		this.rootComponent = this.context.services.rootComponent.create(
			this.foreground,
			sequence,
			parentSequencePlaceIndicator,
			this.context
		);
		this.refreshSize();
	}

	public setPositionAndScale(position: Vector, scale: number) {
		const scaledSize = this.gridPattern.size.multiplyByScalar(scale);
		Dom.attrs(this.pattern, {
			x: position.x,
			y: position.y,
			width: scaledSize.x,
			height: scaledSize.y
		});
		this.gridPattern.setScale(scale, scaledSize);
		Dom.attrs(this.foreground, {
			transform: `translate(${position.x}, ${position.y}) scale(${scale})`
		});
	}

	public getCanvasPosition(): Vector {
		const rect = this.canvas.getBoundingClientRect();
		return new Vector(rect.x + window.scrollX, rect.y + window.scrollY);
	}

	public getCanvasSize(): Vector {
		return new Vector(this.canvas.clientWidth, this.canvas.clientHeight);
	}

	public bindClick(handler: (position: Vector, target: Element, buttonIndex: number) => void) {
		this.canvas.addEventListener(
			'mousedown',
			e => {
				e.preventDefault();
				handler(readMousePosition(e), e.target as Element, e.button);
			},
			false
		);

		this.canvas.addEventListener(
			'touchstart',
			e => {
				e.preventDefault();
				const clientPosition = readTouchClientPosition(e);
				const element = document.elementFromPoint(clientPosition.x, clientPosition.y);
				if (element) {
					const position = readTouchPosition(e);
					handler(position, element, 0);
				}
			},
			listenerOptions
		);
	}

	public bindContextMenu(handler: (position: Vector, target: Element) => void) {
		this.canvas.addEventListener(
			'contextmenu',
			e => {
				e.preventDefault();
				handler(readMousePosition(e), e.target as Element);
			},
			false
		);
	}

	public bindWheel(handler: (e: WheelEvent) => void) {
		this.canvas.addEventListener('wheel', handler, listenerOptions);
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
