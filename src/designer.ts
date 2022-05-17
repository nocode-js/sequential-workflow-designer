import { AnchorStepComponent } from './components/anchor-step-component';
import { SequenceComponent } from './components/sequence-component';
import { StepComponentFactory } from './components/step-component-factory';
import { Sequence } from './definition';
import { createSvgElement, setAttrs } from './svg';
import { Vector } from './vector';

const GRID_SIZE = 8;

export class Designer {

	public static create(parent: HTMLElement, sequence: Sequence) {
		const defs = createSvgElement('defs');
		const gridPattern = createSvgElement('pattern', {
			id: 'sqd-grid',
			patternUnits: 'userSpaceOnUse'
		});
		const gridPatternPath = createSvgElement('path', {
			class: 'sqd-grid-path',
			fill: 'none',
			'stroke-width': 1
		});

		defs.appendChild(gridPattern);
		gridPattern.appendChild(gridPatternPath);

		const foreground = createSvgElement('g');

		const canvas = createSvgElement('svg');
		canvas.appendChild(defs);
		canvas.appendChild(createSvgElement('rect', {
			width: '100%',
			height: '100%',
			fill: 'url(#sqd-grid)'
		}));
		canvas.appendChild(foreground);

		const component = SequenceComponent.createForComponents([
			AnchorStepComponent.create(),
			...sequence.steps.map(StepComponentFactory.create),
			AnchorStepComponent.create()
		], true);
		foreground.appendChild(component.g);

		const container = document.createElement('div');
		container.className = 'sqd-designer';
		container.appendChild(canvas);
		parent.appendChild(container);

		const designer = new Designer(parent, canvas, gridPattern, gridPatternPath, foreground);
		designer.refreshPosition();
		designer.refreshSize();

		window.addEventListener('resize', () => designer.refreshSize());
		container.addEventListener('mousedown', e => designer.onMousedown(e));
		container.addEventListener('mousemove', e => designer.onMousemove(e));
		container.addEventListener('mouseup', () => designer.onMouseup());
		container.addEventListener('wheel', e => designer.onWheel(e));
		return designer;
	}

	private mouseStartPos?: Vector;
	private startPosition?: Vector;
	private position = new Vector(10, 10);
	private scale = 1;

	public constructor(
		private readonly parent: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement) {
	}

	public onMousedown(e: MouseEvent) {
		e.preventDefault();
		this.mouseStartPos = new Vector(e.clientX, e.clientY);
		this.startPosition = this.position;
	}

	public onMousemove(e: MouseEvent) {
		e.preventDefault();

		if (this.mouseStartPos && this.startPosition) {
			const delta = this.mouseStartPos.subtract(new Vector(e.clientX, e.clientY));
			this.position = this.startPosition.subtract(delta);
			this.refreshPosition();
		}
	}

	public onMouseup() {
		this.mouseStartPos = undefined;
		this.startPosition = undefined;
	}

	public onWheel(e: WheelEvent) {
		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		this.scale = Math.min(Math.max(this.scale + delta, 0.1), 3);
		this.refreshPosition();
	}

	public refreshPosition() {
		const size = GRID_SIZE * this.scale;
		setAttrs(this.gridPattern, {
			x: this.position.x,
			y: this.position.y,
			width: size,
			height: size
		});
		setAttrs(this.gridPatternPath, {
			d: `M ${size} 0 L 0 0 0 ${size}`
		});
		setAttrs(this.foreground, {
			transform: `translate(${this.position.x}, ${this.position.y}) scale(${this.scale})`
		});
	}

	public refreshSize() {
		setAttrs(this.canvas, {
			width: this.parent.offsetWidth,
			height: this.parent.offsetHeight
		});
	}
}
