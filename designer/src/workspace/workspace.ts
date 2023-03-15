import { race } from '../core/simple-event-race';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { DesignerContext } from '../designer-context';
import { Component, Placeholder, StepComponent } from './component';
import { WorkspaceView } from './workspace-view';
import { DefinitionChangedEvent, DefinitionChangeType, DesignerState } from '../designer-state';
import { WorkspaceController } from './workspace-controller';
import { ClickBehaviorResolver } from '../behaviors/click-behavior-resolver';
import { BehaviorController } from '../behaviors/behavior-controller';
import { StepsTraverser } from '../core/steps-traverser';
import { SimpleEvent } from '../core/simple-event';
import { SequencePlaceIndicator, ViewPort, WheelController } from '../designer-extension';
import { DesignerApi } from '../api/designer-api';
import { ViewPortApi } from '../api/view-port-api';

export class Workspace implements WorkspaceController {
	public static create(parent: HTMLElement, designerContext: DesignerContext, api: DesignerApi): Workspace {
		const view = WorkspaceView.create(parent, designerContext.componentContext);

		const clickBehaviorResolver = new ClickBehaviorResolver(designerContext, designerContext.state);
		const wheelController = designerContext.services.wheelController.create(api.workspace);
		const workspace = new Workspace(
			view,
			designerContext.stepsTraverser,
			designerContext.state,
			designerContext.behaviorController,
			wheelController,
			clickBehaviorResolver,
			api.viewPort
		);
		setTimeout(() => {
			workspace.render();
			api.viewPort.resetViewPort();
			workspace.onReady.forward();
		});

		designerContext.setWorkspaceController(workspace);
		designerContext.state.onViewPortChanged.subscribe(vp => workspace.onViewPortChanged(vp));
		designerContext.state.onIsDraggingChanged.subscribe(is => workspace.onIsDraggingChanged(is));

		race(
			0,
			designerContext.state.onDefinitionChanged,
			designerContext.state.onSelectedStepIdChanged,
			designerContext.state.onFolderPathChanged
		).subscribe(r => {
			workspace.onStateChanged(r[0], r[1], r[2]);
		});

		view.bindClick((p, t, b) => workspace.onClick(p, t, b));
		view.bindWheel(e => workspace.onWheel(e));
		view.bindContextMenu(e => workspace.onContextMenu(e));
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
		private readonly wheelController: WheelController,
		private readonly clickBehaviorResolver: ClickBehaviorResolver,
		private readonly viewPortApi: ViewPortApi
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

	public getCanvasPosition(): Vector {
		return this.view.getCanvasPosition();
	}

	public getCanvasSize(): Vector {
		return this.view.getCanvasSize();
	}

	public getRootComponentSize(): Vector {
		const view = this.getRootComponent().view;
		return new Vector(view.width, view.height);
	}

	public refreshSize() {
		setTimeout(() => this.view.refreshSize());
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
			const forceDisableDrag = isMiddleButton;
			const behavior = this.clickBehaviorResolver.resolve(rootComponent, target, position, forceDisableDrag);
			this.behaviorController.start(position, behavior);
		}
	}

	private onWheel(e: WheelEvent) {
		e.preventDefault();
		e.stopPropagation();

		this.wheelController.onWheel(e);
	}

	private onContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	private onIsDraggingChanged(isDragging: boolean) {
		this.getRootComponent().setIsDragging(isDragging);
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
			this.viewPortApi.resetViewPort();
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
