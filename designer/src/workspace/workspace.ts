import { race } from '../core/simple-event-race';
import { Vector } from '../core/vector';
import { DefinitionWalker, Sequence, StepChildrenType } from '../definition';
import { DesignerContext } from '../designer-context';
import { ClickCommand, ClickDetails, Component, Placeholder } from './component';
import { WorkspaceView } from './workspace-view';
import { DefinitionChangedEvent, DesignerState } from '../designer-state';
import { WorkspaceController } from './workspace-controller';
import { ClickBehaviorResolver } from '../behaviors/click-behavior-resolver';
import { BehaviorController } from '../behaviors/behavior-controller';
import { SimpleEvent } from '../core/simple-event';
import { SequencePlaceIndicator, Viewport, WheelController } from '../designer-extension';
import { DesignerApi } from '../api/designer-api';
import { StepComponent } from './step-component';
import { BadgesResultFactory } from './badges/badges-result-factory';
import { Services } from '../services';
import { findValidationBadgeIndex } from './badges/find-validation-badge-index';
import { ContextMenuController } from './context-menu/context-menu-controller';
import { ViewportApi } from '../api/viewport-api';
import { DefinitionChangeType } from '../designer-configuration';

export class Workspace implements WorkspaceController {
	public static create(parent: HTMLElement, designerContext: DesignerContext, api: DesignerApi): Workspace {
		const view = WorkspaceView.create(parent, designerContext.componentContext);

		const clickBehaviorResolver = new ClickBehaviorResolver(designerContext, designerContext.state);
		const wheelController = designerContext.services.wheelController.create(api.workspace);
		const contextMenuController = new ContextMenuController(
			designerContext.theme,
			api.viewport,
			designerContext.definitionModifier,
			designerContext.state,
			designerContext.configuration
		);

		const workspace = new Workspace(
			view,
			designerContext.definitionWalker,
			designerContext.state,
			designerContext.behaviorController,
			wheelController,
			contextMenuController,
			clickBehaviorResolver,
			api.viewport,
			designerContext.services
		);
		setTimeout(() => {
			workspace.updateRootComponent();
			api.viewport.resetViewport();
			workspace.onReady.forward();
		});

		designerContext.setWorkspaceController(workspace);
		designerContext.state.onViewportChanged.subscribe(vp => workspace.onViewportChanged(vp));
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
		view.bindContextMenu((p, t) => workspace.onContextMenu(p, t));
		return workspace;
	}

	public readonly onReady = new SimpleEvent<void>();
	public isValid = false;

	private selectedStepComponent: StepComponent | null = null;
	private validationErrorBadgeIndex: number | null = null;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly definitionWalker: DefinitionWalker,
		private readonly state: DesignerState,
		private readonly behaviorController: BehaviorController,
		private readonly wheelController: WheelController,
		private readonly contextMenuController: ContextMenuController,
		private readonly clickBehaviorResolver: ClickBehaviorResolver,
		private readonly viewportApi: ViewportApi,
		private readonly services: Services
	) {}

	public updateRootComponent() {
		this.selectedStepComponent = null;

		let parentSequencePlaceIndicator: SequencePlaceIndicator | null;
		let sequence: Sequence;

		const stepId = this.state.tryGetLastStepIdFromFolderPath();
		if (stepId) {
			const parentSequence = this.definitionWalker.getParentSequence(this.state.definition, stepId);
			const children = this.definitionWalker.getChildren(parentSequence.step);
			if (!children || children.type !== StepChildrenType.sequence) {
				throw new Error('Cannot find single sequence in folder step');
			}
			sequence = children.items as Sequence;

			parentSequencePlaceIndicator = {
				sequence: parentSequence.parentSequence,
				index: parentSequence.index
			};
		} else {
			sequence = this.state.definition.sequence;
			parentSequencePlaceIndicator = null;
		}

		this.view.render(sequence, parentSequencePlaceIndicator);
		this.trySelectStepComponent(this.state.selectedStepId);
		this.updateBadges();
	}

	public updateBadges() {
		const result = BadgesResultFactory.create(this.services);
		this.getRootComponent().updateBadges(result);

		if (this.validationErrorBadgeIndex === null) {
			this.validationErrorBadgeIndex = findValidationBadgeIndex(this.services.badges);
		}
		this.isValid = Boolean(result[this.validationErrorBadgeIndex]);
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

	public updateCanvasSize() {
		setTimeout(() => this.view.refreshSize());
	}

	public destroy() {
		this.contextMenuController.destroy();
		this.view.destroy();
	}

	private onClick(position: Vector, target: Element, buttonIndex: number) {
		const isPrimaryButton = buttonIndex === 0;
		const isMiddleButton = buttonIndex === 1;

		if (isPrimaryButton || isMiddleButton) {
			const commandOrNull = this.resolveClick(target, position);
			const behavior = this.clickBehaviorResolver.resolve(commandOrNull, target, isMiddleButton);
			this.behaviorController.start(position, behavior);
		}
	}

	private onWheel(e: WheelEvent) {
		e.preventDefault();
		e.stopPropagation();

		this.wheelController.onWheel(e);
	}

	private onContextMenu(position: Vector, target: Element) {
		const commandOrNull = this.resolveClick(target, position);
		this.contextMenuController.tryOpen(position, commandOrNull);
	}

	private onIsDraggingChanged(isDragging: boolean) {
		this.getRootComponent().setIsDragging(isDragging);
	}

	private onViewportChanged(viewport: Viewport) {
		this.view.setPositionAndScale(viewport.position, viewport.scale);
	}

	private onStateChanged(
		definitionChanged: DefinitionChangedEvent | undefined,
		selectedStepIdChanged: string | null | undefined,
		folderPathChanged: string[] | undefined
	) {
		if (folderPathChanged) {
			this.updateRootComponent();
			this.viewportApi.resetViewport();
		} else if (definitionChanged) {
			if (definitionChanged.changeType === DefinitionChangeType.stepPropertyChanged) {
				this.updateBadges();
			} else {
				this.updateRootComponent();
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

	private resolveClick(element: Element, position: Vector): ClickCommand | null {
		const click: ClickDetails = {
			element,
			position,
			scale: this.state.viewport.scale
		};
		return this.getRootComponent().resolveClick(click);
	}

	private getRootComponent(): Component {
		if (this.view.rootComponent) {
			return this.view.rootComponent;
		}
		throw new Error('Root component not found');
	}
}
