import { BehaviorController } from '../behaviors/behavior-controller';
import { MoveViewPortBehavior } from '../behaviors/move-view-port-behavior';
import { SelectStepBehavior } from '../behaviors/select-step-behavior';
import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { AnchorStepComponent } from './anchor-step-component';
import { Placeholder, StepComponent, StepComponentState } from './component';
import { SequenceComponent } from './sequence-component';
import { StepComponentFactory } from './step-component-factory';

const GRID_SIZE = 50;

export class Workspace {

	public static append(parent: HTMLElement, sequence: Sequence, behaviorController: BehaviorController): Workspace {
		const view = WorkspaceView.create(parent);

		const workspace = new Workspace(view, sequence, behaviorController);
		workspace.view.refreshSize();
		workspace.render();

		workspace.view.bindResize(() => workspace.view.refreshSize());
		workspace.view.bindMouseDown(e => workspace.onMouseDown(e));
		workspace.view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	private sequenceComponent?: SequenceComponent;
	private selectedStep: StepComponent | null = null;

	private position = new Vector(10, 10);
	private scale = 1.0;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly sequence: Sequence,
		private readonly behaviorController: BehaviorController) {
	}

	public render() {
		this.sequenceComponent = SequenceComponent.createForComponents([
			AnchorStepComponent.create(true),
			...this.sequence.steps.map(s => StepComponentFactory.create(s, this.sequence)),
			AnchorStepComponent.create(false)
		], this.sequence, true);
		this.view.setSequence(this.sequenceComponent);

		this.setPosition(new Vector(
			Math.max(0, (this.view.getWidth() - this.sequenceComponent.view.width) / 2),
			20));
	}

	public onMouseDown(e: MouseEvent) {
		if (!this.sequenceComponent) {
			return;
		}
		const isNotScrollClick = (e.button !== 1);
		const clickedStep = isNotScrollClick
			? this.sequenceComponent.findStepComponent(e.target as Element)
			: null;

		if (clickedStep && clickedStep.canDrag) {
			this.behaviorController.start(e, SelectStepBehavior.create(clickedStep, this));
		} else {
			this.behaviorController.start(e, MoveViewPortBehavior.create(this.position, this));
		}
	}

	public onWheel(e: WheelEvent) {
		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		this.scale = Math.min(Math.max(this.scale + delta, 0.1), 3);
		this.refreshPosition();
	}

	public setPosition(position: Vector) {
		this.position = position;
		this.refreshPosition();
	}

	public refreshPosition() {
		this.view.setPositionAndScale(this.position, this.scale);
	}

	public selectStep(step: StepComponent) {
		if (this.selectedStep) {
			this.selectedStep.setState(StepComponentState.default);
		}
		this.selectedStep = step;
		this.selectedStep.setState(StepComponentState.selected);
	}

	public clearSelectedStep() {
		if (this.selectedStep) {
			this.selectedStep.setState(StepComponentState.default);
			this.selectedStep = null;
		}
	}

	public setDropMode(isEnabled: boolean) {
		this.sequenceComponent?.setDropMode(isEnabled);
	}

	public findPlaceholder(element: Element): Placeholder | null {
		return this.sequenceComponent?.findPlaceholder(element) || null;
	}
}

export class WorkspaceView {

	public static create(parent: HTMLElement): WorkspaceView {
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
		return new WorkspaceView(parent, canvas, gridPattern, gridPatternPath, foreground);
	}

	private constructor(
		private readonly parent: HTMLElement,
		private readonly canvas: SVGElement,
		private readonly gridPattern: SVGPatternElement,
		private readonly gridPatternPath: SVGPathElement,
		private readonly foreground: SVGGElement) {
	}

	public setSequence(cequenceComponent: SequenceComponent) {
		this.foreground.innerHTML = '';
		this.foreground.appendChild(cequenceComponent.view.g);
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
			width: this.parent.offsetWidth,
			height: this.parent.offsetHeight
		});
	}

	public getWidth(): number {
		return this.canvas.clientWidth;
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
