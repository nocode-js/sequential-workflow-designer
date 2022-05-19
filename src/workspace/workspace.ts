import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { AnchorStepComponent } from './anchor-step-component';
import { StepComponent, StepComponentState } from './component';
import { SequenceComponent } from './sequence-component';
import { StepComponentFactory } from './step-component-factory';

const GRID_SIZE = 50;

export class Workspace {

	public static append(parent: HTMLElement, sequence: Sequence): Workspace {
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

		const sequenceComponent = SequenceComponent.createForComponents([
			AnchorStepComponent.create(true),
			...sequence.steps.map(StepComponentFactory.create),
			AnchorStepComponent.create(false)
		], true);

		const foreground = Svg.element('g');
		foreground.appendChild(sequenceComponent.g);

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

		parent.appendChild(canvas);

		const workspace = new Workspace(parent, canvas, gridPattern, gridPatternPath, foreground, sequenceComponent);
		workspace.refreshPosition();
		workspace.refreshSize();

		window.addEventListener('resize', () => workspace.refreshSize());
		canvas.addEventListener('mousedown', e => workspace.onMouseDown(e));
		canvas.addEventListener('wheel', e => workspace.onWheel(e));
		return workspace;
	}

	private interaction?: {
		startMousePos: Vector;
		startPosition: Vector;
		component: StepComponent | null;
		isDragging?: boolean;
	};

	private selectedComponent: StepComponent | null = null;

	private position = new Vector(10, 10);
	private scale = 1.0;

	private readonly onMouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
	private readonly onMouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);

	public constructor(
		private readonly parent: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement,
		private readonly sequence: SequenceComponent) {
	}

	public onMouseDown(e: MouseEvent) {
		if (this.interaction) {
			this.onMouseUp(e);
			return;
		}

		e.preventDefault();

		const isNotScrollClick = (e.button !== 1);
		this.interaction = {
			startMousePos: new Vector(e.clientX, e.clientY),
			startPosition: this.position,
			component: isNotScrollClick
				? this.sequence.findComponent(e.target as SVGElement)
				: null
		};

		if (this.selectedComponent && this.selectedComponent !== this.interaction.component) {
			this.selectedComponent.setState(StepComponentState.default);
			this.selectedComponent = null;
		}

		window.addEventListener('mousemove', this.onMouseMoveHandler);
		window.addEventListener('mouseup', this.onMouseUpHandler);
	}

	public onMouseMove(e: MouseEvent) {
		e.preventDefault();

		if (this.interaction) {
			const delta = this.interaction.startMousePos.subtract(new Vector(e.clientX, e.clientY));

			if (!this.interaction.component) {
				this.position = this.interaction.startPosition.subtract(delta);
				this.refreshPosition();
			}
			else if (this.interaction.isDragging) {
				console.log('dragiging');
			}
			else if (this.interaction.component.canDrag && delta.distance() > 2) {
				this.sequence.setDropMode(true);
				this.interaction.component.setState(StepComponentState.moving);
				this.interaction.isDragging = true;
			}
		}
	}

	public onMouseUp(e: MouseEvent) {
		e.preventDefault();

		if (this.interaction) {
			if (this.interaction.component) {
				if (this.interaction.isDragging) {
					this.interaction.component.setState(StepComponentState.default);
					this.sequence.setDropMode(false);
				} else if (this.interaction.component !== this.selectedComponent) {
					if (this.selectedComponent) {
						this.selectedComponent.setState(StepComponentState.default);
					}
					this.selectedComponent = this.interaction.component;
					this.selectedComponent.setState(StepComponentState.selected);
				}
			}

			window.removeEventListener('mousemove', this.onMouseMove);
			window.removeEventListener('mouseup', this.onMouseUpHandler);
			this.interaction = undefined;
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
