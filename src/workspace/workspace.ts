import { MoveViewPortBehavior } from '../behaviors/move-view-port-behavior';
import { SelectStepBehavior } from '../behaviors/select-step-behavior';
import { race } from '../core/simple-event-race';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { Placeholder, StepComponent, StepComponentState } from './component';
import { StartStopComponent } from './start-stop/start-stop-component';
import { WorkspaceView } from './workspace-view';
import { BehaviorController } from '../behaviors/behavior-controller';
import { DefinitionChangeType, DesignerState, ViewPort } from '../designer-state';
import { ViewPortAnimator } from './view-port-animator';
import { WorkspaceController } from './workspace-controller';

const WHEEL_DELTA = 0.1;
const ZOOM_DELTA = 0.2;

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export class Workspace implements WorkspaceController {
	public static create(parent: HTMLElement, context: DesignerContext): Workspace {
		const view = WorkspaceView.create(parent, context.configuration.steps);

		const viewPortAnimator = new ViewPortAnimator(context.state);
		const workspace = new Workspace(view, context, context.state, context.behaviorController, viewPortAnimator);
		setTimeout(() => {
			workspace.render();
			workspace.resetViewPort();
		});

		context.setWorkspaceController(workspace);
		context.state.onViewPortChanged.subscribe(vp => workspace.onViewPortChanged(vp));
		context.state.onIsDraggingChanged.subscribe(i => workspace.onIsDraggingChanged(i));
		context.state.onIsSmartEditorCollapsedChanged.subscribe(() => workspace.onIsSmartEditorCollapsedChanged());

		race(0, context.state.onDefinitionChanged, context.state.onSelectedStepChanged).subscribe(r => {
			const [definitionChanged, selectedStep] = r;
			if (definitionChanged) {
				if (definitionChanged.changeType === DefinitionChangeType.stepPropertyChanged) {
					workspace.revalidate();
				} else {
					workspace.render();
				}
			} else if (selectedStep !== undefined) {
				workspace.onSelectedStepChanged(selectedStep);
			}
		});

		view.bindMouseDown((p, t, b) => workspace.onMouseDown(p, t, b));
		view.bindTouchStart(e => workspace.onTouchStart(e));
		view.bindContextMenu(e => workspace.onContextMenu(e));
		view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	public isValid = false;

	private selectedStepComponent: StepComponent | null = null;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly context: DesignerContext,
		private readonly state: DesignerState,
		private readonly behaviorController: BehaviorController,
		private readonly viewPortAnimator: ViewPortAnimator
	) {}

	public render() {
		this.selectedStepComponent = null;

		this.view.render(this.state.definition.sequence);
		this.selectStep(this.state.selectedStep);
		this.revalidate();
	}

	public getPlaceholders(): Placeholder[] {
		const result: Placeholder[] = [];
		this.getRootComponent().getPlaceholders(result);
		return result;
	}

	public getComponentByStepId(stepId: string): StepComponent {
		const component = this.getRootComponent().findById(stepId);
		if (!component) {
			throw new Error(`Cannot find component for step id: ${stepId}`);
		}
		return component;
	}

	public resetViewPort() {
		const rcv = this.getRootComponent().view;
		const clientSize = this.view.getClientSize();
		const x = Math.max(0, (clientSize.x - rcv.width) / 2);
		const y = Math.max(0, (clientSize.y - rcv.height) / 2);

		this.state.setViewPort(new Vector(x, y), 1);
	}

	public zoom(direction: boolean): void {
		const delta = direction ? ZOOM_DELTA : -ZOOM_DELTA;
		const scale = this.limitScale(this.state.viewPort.scale + delta);
		this.state.setViewPort(this.state.viewPort.position, scale);
	}

	public moveViewPortToStep(stepComponent: StepComponent) {
		const vp = this.state.viewPort;
		const componentPosition = stepComponent.view.getClientPosition();
		const clientSize = this.view.getClientSize();

		const realPos = vp.position.divideByScalar(vp.scale).subtract(componentPosition.divideByScalar(vp.scale));
		const componentOffset = new Vector(stepComponent.view.width, stepComponent.view.height).divideByScalar(2);

		const newPosition = realPos.add(clientSize.divideByScalar(2)).subtract(componentOffset);

		this.viewPortAnimator.execute(newPosition, 1);
	}

	public destroy() {
		this.view.destroy();
	}

	private revalidate() {
		this.isValid = this.getRootComponent().validate();
	}

	private onMouseDown(position: Vector, target: Element, button: number) {
		const isPrimaryButton = button === 0;
		const isMiddleButton = button === 1;
		if (isPrimaryButton || isMiddleButton) {
			this.startBehavior(target, position, isMiddleButton);
		}
	}

	private onTouchStart(position: Vector) {
		const element = document.elementFromPoint(position.x, position.y);
		if (element) {
			this.startBehavior(element, position, false);
		}
	}

	private onContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	private startBehavior(target: Element, position: Vector, forceMoveMode: boolean) {
		const clickedStep =
			!forceMoveMode && !this.state.isMoveModeEnabled ? this.getRootComponent().findByElement(target as Element) : null;

		if (clickedStep) {
			this.behaviorController.start(position, SelectStepBehavior.create(clickedStep, this.context));
		} else {
			this.behaviorController.start(position, MoveViewPortBehavior.create(this.state));
		}
	}

	private onWheel(e: WheelEvent) {
		const viewPort = this.state.viewPort;
		const mousePoint = new Vector(e.pageX, e.pageY).subtract(this.view.getClientPosition());
		// The real point is point on canvas with no scale.
		const mouseRealPoint = mousePoint.divideByScalar(viewPort.scale).subtract(viewPort.position.divideByScalar(viewPort.scale));

		const wheelDelta = e.deltaY > 0 ? -WHEEL_DELTA : WHEEL_DELTA;
		const newScale = this.limitScale(viewPort.scale + wheelDelta);

		const position = mouseRealPoint.multiplyByScalar(-newScale).add(mousePoint);
		const scale = newScale;

		this.state.setViewPort(position, scale);
	}

	private onIsDraggingChanged(isDragging: boolean) {
		this.getRootComponent().setIsDragging(isDragging);
	}

	private onIsSmartEditorCollapsedChanged() {
		setTimeout(() => this.view.refreshSize());
	}

	private onViewPortChanged(viewPort: ViewPort) {
		this.view.setPositionAndScale(viewPort.position, viewPort.scale);
	}

	private onSelectedStepChanged(step: Step | null) {
		this.selectStep(step);
	}

	private selectStep(step: Step | null) {
		if (this.selectedStepComponent) {
			this.selectedStepComponent.setState(StepComponentState.default);
			this.selectedStepComponent = null;
		}
		if (step) {
			this.selectedStepComponent = this.getRootComponent().findById(step.id);
			if (!this.selectedStepComponent) {
				throw new Error(`Cannot find a step's component by id ${step.id}`);
			}
			this.selectedStepComponent.setState(StepComponentState.selected);
		}
	}

	private limitScale(scale: number): number {
		return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
	}

	private getRootComponent(): StartStopComponent {
		if (this.view.rootComponent) {
			return this.view.rootComponent;
		}
		throw new Error('Root component not found');
	}
}
