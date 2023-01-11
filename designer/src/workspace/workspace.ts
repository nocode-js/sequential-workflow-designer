import { race } from '../core/simple-event-race';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { DesignerContext } from '../designer-context';
import { Component, Placeholder, StepComponent } from './component';
import { SequencePlaceIndicator } from './start-stop/start-stop-component';
import { WorkspaceView } from './workspace-view';
import { DefinitionChangedEvent, DefinitionChangeType, DesignerState, ViewPort } from '../designer-state';
import { ViewPortAnimator } from './view-port-animator';
import { WorkspaceController } from './workspace-controller';
import { ComponentContext } from './component-context';
import { ClickBehaviorResolver } from '../behaviors/click-behavior-resolver';
import { BehaviorController } from '../behaviors/behavior-controller';
import { StepsTraverser } from '../core/steps-traverser';
import { ViewPortCalculator } from './view-port-calculator';
import { SimpleEvent } from '../core/simple-event';

export class Workspace implements WorkspaceController {
	public static create(parent: HTMLElement, designerContext: DesignerContext, componentContext: ComponentContext): Workspace {
		const view = WorkspaceView.create(parent, componentContext);

		const viewPortAnimator = new ViewPortAnimator(designerContext.state);
		const clickBehaviorResolver = new ClickBehaviorResolver(designerContext, componentContext, designerContext.state);
		const workspace = new Workspace(
			view,
			designerContext.stepsTraverser,
			designerContext.state,
			designerContext.behaviorController,
			clickBehaviorResolver,
			viewPortAnimator
		);
		setTimeout(() => {
			workspace.render();
			workspace.resetViewPort();
			workspace.onReady.forward();
		});

		designerContext.setWorkspaceController(workspace);
		designerContext.state.onViewPortChanged.subscribe(vp => workspace.onViewPortChanged(vp));
		designerContext.state.onIsDraggingChanged.subscribe(i => workspace.onIsDraggingChanged(i));
		designerContext.state.onIsSmartEditorCollapsedChanged.subscribe(() => workspace.onIsSmartEditorCollapsedChanged());

		race(
			0,
			designerContext.state.onDefinitionChanged,
			designerContext.state.onSelectedStepIdChanged,
			designerContext.state.onFolderPathChanged
		).subscribe(r => {
			workspace.onStateChanged(r[0], r[1], r[2]);
		});

		view.bindClick((p, t, b) => workspace.onClick(p, t, b));
		view.bindContextMenu(e => workspace.onContextMenu(e));
		view.bindWheel(e => workspace.onWheel(e));
		return workspace;
	}

	public readonly onReady = new SimpleEvent<void>();
	public isValid = false;

	private selectedStepComponent: StepComponent | null = null;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly stepsTraverser: StepsTraverser,
		private readonly state: DesignerState,
		private readonly behaviorController: BehaviorController,
		private readonly clickBehaviorResolver: ClickBehaviorResolver,
		private readonly viewPortAnimator: ViewPortAnimator
	) {}

	public render() {
		this.selectedStepComponent = null;

		let parentSequencePlaceIndicator: SequencePlaceIndicator | null;
		let sequence: Sequence;

		const stepId = this.state.tryGetLastStepIdFromFolderPath();
		if (stepId) {
			const result = this.stepsTraverser.getChildAndParentSequences(this.state.definition, stepId);
			sequence = result.childSequence;
			parentSequencePlaceIndicator = {
				sequence: result.parentSequence,
				index: result.index
			};
		} else {
			sequence = this.state.definition.sequence;
			parentSequencePlaceIndicator = null;
		}

		this.view.render(sequence, parentSequencePlaceIndicator);
		this.trySelectStepComponent(this.state.selectedStepId);
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
		const clientCanvasSize = this.view.getClientCanvasSize();
		const newViewPort = ViewPortCalculator.center(clientCanvasSize, rcv);
		this.state.setViewPort(newViewPort);
	}

	public zoom(direction: boolean): void {
		const newViewPort = ViewPortCalculator.zoom(this.state.viewPort, direction);
		this.state.setViewPort(newViewPort);
	}

	public moveViewPortToStep(stepComponent: StepComponent) {
		const vp = this.state.viewPort;
		const componentPosition = stepComponent.view.getClientPosition();
		const clientSize = this.view.getClientCanvasSize();

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

	private onClick(position: Vector, target: Element, buttonIndex: number) {
		const isPrimaryButton = buttonIndex === 0;
		const isMiddleButton = buttonIndex === 1;
		if (isPrimaryButton || isMiddleButton) {
			const rootComponent = this.getRootComponent();
			const behavior = this.clickBehaviorResolver.resolve(rootComponent, target, position, isMiddleButton);
			this.behaviorController.start(position, behavior);
		}
	}

	private onContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	private onWheel(e: WheelEvent) {
		const newViewPort = ViewPortCalculator.zoomByWheel(this.state.viewPort, e, this.view.getClientPosition());
		this.state.setViewPort(newViewPort);
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

	private onStateChanged(
		definitionChanged: DefinitionChangedEvent | undefined,
		selectedStepIdChanged: string | null | undefined,
		folderPathChanged: string[] | undefined
	) {
		if (folderPathChanged) {
			this.render();
			this.resetViewPort();
		} else if (definitionChanged) {
			if (definitionChanged.changeType === DefinitionChangeType.stepPropertyChanged) {
				this.revalidate();
			} else {
				this.render();
			}
		} else if (selectedStepIdChanged !== undefined) {
			this.trySelectStepComponent(selectedStepIdChanged);
		}
	}

	private trySelectStepComponent(stepId: string | null) {
		if (this.selectedStepComponent) {
			this.selectedStepComponent.setIsSelected(false);
			this.selectedStepComponent = null;
		}
		if (stepId) {
			this.selectedStepComponent = this.getRootComponent().findById(stepId);
			if (this.selectedStepComponent) {
				this.selectedStepComponent.setIsSelected(true);
			}
		}
	}

	private getRootComponent(): Component {
		if (this.view.rootComponent) {
			return this.view.rootComponent;
		}
		throw new Error('Root component not found');
	}
}
