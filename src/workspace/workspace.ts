import { MoveViewPortBehavior } from '../behaviors/move-view-port-behavior';
import { SelectStepBehavior } from '../behaviors/select-step-behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerComponentProvider, DesignerContext, ViewPort } from '../designer-context';
import { Placeholder, StepComponent, StepComponentState } from './component';
import { StartStopComponent } from './start-stop-component';
import { WorkspaceView } from './views/workspace-view';

export class Workspace implements DesignerComponentProvider {

	public static create(parent: HTMLElement, context: DesignerContext): Workspace {
		const view = WorkspaceView.create(parent, context.configuration.steps);

		const workspace = new Workspace(view, context);
		setTimeout(() => {
			workspace.render();
			workspace.view.refreshSize();
			workspace.resetViewPort();
		});

		context.setProvider(workspace);
		context.onDefinitionChanged.subscribe(() => workspace.render());
		context.onViewPortChanged.subscribe(vp => workspace.onViewPortChanged(vp));
		context.onSelectedStepChanged.subscribe(s => workspace.onSelectedStepChanged(s));
		context.onIsDraggingChanged.subscribe(i => workspace.onIsDraggingChanged(i));

		workspace.view.bindResize(() => workspace.view.refreshSize());
		workspace.view.bindMouseDown(e => workspace.onMouseDown(e));
		workspace.view.bindTouchStart(e => workspace.onTouchStart(e));
		workspace.view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	public isValid = false;

	private selectedStepComponent: StepComponent | null = null;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly context: DesignerContext) {
	}

	public revalidate() {
		this.isValid = this.getRootComponent().validate();
	}

	public render() {
		this.view.render(this.context.definition.sequence);
		this.trySelectStep(this.context.selectedStep);
		this.revalidate();
	}

	public getPlaceholders(): Placeholder[] {
		const result: Placeholder[] = [];
		this.getRootComponent().getPlaceholders(result);
		return result;
	}

	public getSelectedStepComponent(): StepComponent {
		if (this.selectedStepComponent) {
			return this.selectedStepComponent;
		}
		throw new Error('Nothing selected');
	}

	public findStepComponentById(stepId: string): StepComponent | null {
		return this.getRootComponent().findById(stepId);
	}

	public resetViewPort() {
		const rcv = this.getRootComponent().view;
		const clientSize = this.view.getClientSize();
		const x = Math.max(0, (clientSize.x - rcv.width) / 2);
		const y = Math.max(0, (clientSize.y - rcv.height) / 2);

		this.context.setViewPort(new Vector(x, y), 1);
	}

	public moveViewPortToStep(stepComponent: StepComponent) {
		const vp = this.context.viewPort;
		const componentPosition = stepComponent.view.getClientPosition();
		const clientSize = this.view.getClientSize();

		const realPos = vp.position.divideByScalar(vp.scale).subtract(componentPosition.divideByScalar(vp.scale));
		const componentOffset = new Vector(stepComponent.view.width, stepComponent.view.height).divideByScalar(2);

		this.context.animateViewPort(realPos.add(clientSize.divideByScalar(2)).subtract(componentOffset), 1);
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

	private startBehavior(target: Element, position: Vector, forceMoveMode: boolean) {
		const clickedStep = !forceMoveMode && !this.context.isMoveModeEnabled
			? this.getRootComponent().findByElement(target as Element)
			: null;

		if (clickedStep) {
			this.context.behaviorController.start(position, SelectStepBehavior.create(clickedStep, this.context));
		} else {
			this.context.behaviorController.start(position, MoveViewPortBehavior.create(this.context));
		}
	}

	private onWheel(e: WheelEvent) {
		const viewPort = this.context.viewPort;
		const mousePoint = new Vector(e.pageX, e.pageY).subtract(this.view.getClientPosition());
		// The real point is point on canvas with no scale.
		const mouseRealPoint = mousePoint.divideByScalar(viewPort.scale).subtract(viewPort.position.divideByScalar(viewPort.scale));

		const wheelDelta = (e.deltaY > 0 ? -0.1 : 0.1);
		const newScale = Math.min(Math.max(viewPort.scale + wheelDelta, 0.1), 3);

		const position = mouseRealPoint.multiplyByScalar(-newScale).add(mousePoint);
		const scale = newScale;

		this.context.setViewPort(position, scale);
	}

	private onIsDraggingChanged(isDragging: boolean) {
		this.getRootComponent().setIsDragging(isDragging);
	}

	private onViewPortChanged(viewPort: ViewPort) {
		this.view.setPositionAndScale(viewPort.position, viewPort.scale);
	}

	private onSelectedStepChanged(step: Step | null) {
		this.trySelectStep(step);
	}

	private trySelectStep(step: Step | null) {
		if (this.selectedStepComponent) {
			this.selectedStepComponent.setState(StepComponentState.default);
			this.selectedStepComponent = null;
		}
		if (step) {
			this.selectedStepComponent = this.getRootComponent().findById(step.id);
			if (this.selectedStepComponent) {
				this.selectedStepComponent.setState(StepComponentState.selected);
			}
		}
	}

	private getRootComponent(): StartStopComponent {
		if (this.view.rootComponent) {
			return this.view.rootComponent;
		}
		throw new Error('Root component not found');
	}
}
