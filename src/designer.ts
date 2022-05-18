import { AnchorStepComponent } from './components/anchor-step-component';
import { StepComponent, StepComponentState } from './components/component';
import { SequenceComponent } from './components/sequence-component';
import { StepComponentFactory } from './components/step-component-factory';
import { Sequence } from './definition';
import { Svg } from './svg';
import { Vector } from './vector';

const GRID_SIZE = 50;

export class Designer {

	public static create(parent: HTMLElement, sequence: Sequence) {
		const defs = Svg.element('defs');
		const gridPattern = Svg.element('pattern', {
			id: 'sqd-grid',
			patternUnits: 'userSpaceOnUse'
		});
		const gridPatternPath = Svg.element('path', {
			class: 'sqd-grid-path',
			fill: 'none',
			'stroke-width': 1
		});

		defs.appendChild(gridPattern);
		gridPattern.appendChild(gridPatternPath);

		const foreground = Svg.element('g');

		const canvas = Svg.element('svg', {
			class: 'sqd-canvas'
		});
		canvas.appendChild(defs);
		canvas.appendChild(Svg.element('rect', {
			width: '100%',
			height: '100%',
			fill: 'url(#sqd-grid)'
		}));
		canvas.appendChild(foreground);

		const sequenceComponent = SequenceComponent.createForComponents([
			AnchorStepComponent.create(true),
			...sequence.steps.map(StepComponentFactory.create),
			AnchorStepComponent.create(false)
		], true);
		foreground.appendChild(sequenceComponent.g);

		const container = document.createElement('div');
		container.className = 'sqd-designer';
		container.appendChild(canvas);
		parent.appendChild(container);

		const designer = new Designer(parent, canvas, gridPattern, gridPatternPath, foreground, sequenceComponent);
		designer.refreshPosition();
		designer.refreshSize();

		window.addEventListener('resize', () => designer.refreshSize());
		container.addEventListener('mousedown', e => designer.onMouseDown(e));
		container.addEventListener('wheel', e => designer.onWheel(e));
		return designer;
	}

	private interaction?: {
		startMousePos: Vector;
		startPosition: Vector;
		movingComponent?: StepComponent;
	};

	private selectedComponent: StepComponent | null = null;

	private position = new Vector(10, 10);
	private scale = 1.0;

	private readonly onMouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
	private readonly onMouseUpHandler = () => this.onMouseUp();

	public constructor(
		private readonly parent: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement,
		private readonly sequence: SequenceComponent) {
	}

	public onMouseDown(e: MouseEvent) {
		e.preventDefault();

		if (this.interaction) {
			this.onMouseUp();
			return;
		}

		if (this.selectedComponent) {
			this.selectedComponent.setState(StepComponentState.default);
			this.selectedComponent = null;
		}

		if (e.button !== 1) {
			this.selectedComponent = this.sequence.findComponent(e.target as SVGElement);
			if (this.selectedComponent) {
				this.selectedComponent.setState(StepComponentState.selected);
			}
		}

		this.interaction = {
			startMousePos: new Vector(e.clientX, e.clientY),
			startPosition: this.position
		};

		window.addEventListener('mousemove', this.onMouseMoveHandler);
		window.addEventListener('mouseup', this.onMouseUpHandler);
	}

	public onMouseMove(e: MouseEvent) {
		e.preventDefault();

		if (this.interaction) {
			const delta = this.interaction.startMousePos.subtract(new Vector(e.clientX, e.clientY));

			if (!this.selectedComponent) {
				this.position = this.interaction.startPosition.subtract(delta);
				this.refreshPosition();
			}
			else if (this.interaction.movingComponent) {
				// ...
			}
			else if (delta.distance() > 5) {
				this.sequence.setDropMode(true);
				this.interaction.movingComponent = this.selectedComponent;
				this.selectedComponent.setState(StepComponentState.moving);
			}
		}
	}

	public onMouseUp() {
		if (this.interaction) {
			if (this.interaction.movingComponent && this.selectedComponent) {
				this.selectedComponent.setState(StepComponentState.default);
				this.sequence.setDropMode(false);
			}
			this.interaction = undefined;

			window.removeEventListener('mousemove', this.onMouseMove);
			window.removeEventListener('mouseup', this.onMouseUpHandler);
		}
	}

	public onWheel(e: WheelEvent) {
		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		this.scale = Math.min(Math.max(this.scale + delta, 0.1), 3);
		this.refreshPosition();
	}

	public refreshPosition() {
		const size = GRID_SIZE * this.scale;
		Svg.attrs(this.gridPattern, {
			x: this.position.x,
			y: this.position.y,
			width: size,
			height: size
		});
		Svg.attrs(this.gridPatternPath, {
			d: `M ${size} 0 L 0 0 0 ${size}`
		});
		Svg.attrs(this.foreground, {
			transform: `translate(${this.position.x}, ${this.position.y}) scale(${this.scale})`
		});
	}

	public refreshSize() {
		Svg.attrs(this.canvas, {
			width: this.parent.offsetWidth,
			height: this.parent.offsetHeight
		});
	}
}
