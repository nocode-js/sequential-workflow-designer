import { race } from '../core/simple-event-race';
import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { ClickCommand, ClickDetails, Component, FoundPlaceholders } from './component';
import { WorkspaceView } from './workspace-view';
import { DesignerState } from '../designer-state';
import { WorkspaceController } from './workspace-controller';
import { ClickBehaviorResolver } from '../behaviors/click-behavior-resolver';
import { BehaviorController } from '../behaviors/behavior-controller';
import { SimpleEvent } from '../core/simple-event';
import { ClickBehaviorWrapper, SequencePlaceIndicator, Viewport, WheelController } from '../designer-extension';
import { StepComponent } from './step-component';
import { BadgesResultFactory } from './badges/badges-result-factory';
import { Services } from '../services';
import { findValidationBadgeIndex } from './badges/find-validation-badge-index';
import { ContextMenuController } from './context-menu/context-menu-controller';
import { ViewportApi } from '../api/viewport-api';
import { DesignerApi } from '../api/designer-api';
import { WorkspaceApi } from '../api/workspace-api';
import { DefinitionChangedEvent, DefinitionChangeType } from '../designer-configuration';
import { ContextMenuItemsBuilder } from './context-menu/context-menu-items-builder';
import { PinchToZoomController } from './viewport/pinch-to-zoom-controller';

export class Workspace implements WorkspaceController {
	public static create(parent: HTMLElement, designerContext: DesignerContext, api: DesignerApi): Workspace {
		const view = WorkspaceView.create(parent, designerContext.componentContext);

		const clickBehaviorResolver = new ClickBehaviorResolver(designerContext);
		const clickBehaviorWrapper = designerContext.services.clickBehaviorWrapperExtension.create(designerContext.customActionController);

		const wheelController = designerContext.services.wheelController.create(api.viewport, api.workspace);
		const pinchToZoomController = PinchToZoomController.create(api.workspace, api.viewport, api.shadowRoot);

		const contextMenuItemsBuilder = new ContextMenuItemsBuilder(
			api.viewport,
			api.workspace,
			api.i18n,
			designerContext.stateModifier,
			designerContext.state,
			designerContext.services.contextMenu?.createItemsProvider
				? designerContext.services.contextMenu.createItemsProvider(designerContext.customActionController)
				: undefined
		);
		const contextMenuController = new ContextMenuController(
			designerContext.theme,
			designerContext.configuration,
			contextMenuItemsBuilder
		);

		const workspace = new Workspace(
			view,
			designerContext.state,
			designerContext.behaviorController,
			wheelController,
			pinchToZoomController,
			contextMenuController,
			clickBehaviorResolver,
			clickBehaviorWrapper,
			api.viewport,
			api.workspace,
			designerContext.services
		);

		designerContext.setWorkspaceController(workspace);
		designerContext.state.onViewportChanged.subscribe(workspace.onViewportChanged);

		race(
			0,
			designerContext.state.onDefinitionChanged,
			designerContext.state.onSelectedStepIdChanged,
			designerContext.state.onFolderPathChanged
		).subscribe(r => {
			workspace.onStateChanged(r[0], r[1], r[2]);
		});

		view.bindMouseDown(workspace.onClick);
		view.bindTouchStart(workspace.onClick, workspace.onPinchToZoom);
		view.bindWheel(workspace.onWheel);
		view.bindContextMenu(workspace.onContextMenu);

		workspace.scheduleInit();
		return workspace;
	}

	public readonly onRendered = new SimpleEvent<void>();
	public isValid = false;

	private initTimeout: ReturnType<typeof setTimeout> | null = null;
	private selectedStepComponent: StepComponent | null = null;
	private validationErrorBadgeIndex: number | null = null;

	private constructor(
		private readonly view: WorkspaceView,
		private readonly state: DesignerState,
		private readonly behaviorController: BehaviorController,
		private readonly wheelController: WheelController,
		private readonly pinchToZoomController: PinchToZoomController,
		private readonly contextMenuController: ContextMenuController,
		private readonly clickBehaviorResolver: ClickBehaviorResolver,
		private readonly clickBehaviorWrapper: ClickBehaviorWrapper,
		private readonly viewportApi: ViewportApi,
		private readonly workspaceApi: WorkspaceApi,
		private readonly services: Services
	) {}

	public scheduleInit() {
		this.initTimeout = setTimeout(() => {
			this.initTimeout = null;
			this.updateRootComponent();
			this.viewportApi.resetViewport();
		});
	}

	public updateRootComponent() {
		this.selectedStepComponent = null;

		const rootSequence = this.workspaceApi.getRootSequence();
		const parentPlaceIndicator: SequencePlaceIndicator | null = rootSequence.parentStep
			? {
					sequence: rootSequence.parentStep.parentSequence,
					index: rootSequence.parentStep.index
				}
			: null;

		this.view.render(rootSequence.sequence, parentPlaceIndicator);
		this.trySelectStepComponent(this.state.selectedStepId);
		this.updateBadges();

		this.onRendered.forward();
	}

	public updateBadges() {
		const result = BadgesResultFactory.create(this.services);
		this.getRootComponent().updateBadges(result);

		if (this.validationErrorBadgeIndex === null) {
			this.validationErrorBadgeIndex = findValidationBadgeIndex(this.services.badges);
		}
		this.isValid = Boolean(result[this.validationErrorBadgeIndex]);
	}

	public resolvePlaceholders(skipComponent: StepComponent | undefined): FoundPlaceholders {
		const result: FoundPlaceholders = {
			placeholders: [],
			components: []
		};
		this.getRootComponent().resolvePlaceholders(skipComponent, result);
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
		if (this.initTimeout) {
			clearTimeout(this.initTimeout);
			this.initTimeout = null;
		}
		this.contextMenuController.destroy();
		this.view.destroy();
	}

	private readonly onClick = (position: Vector, target: Element, buttonIndex: number, altKey: boolean) => {
		const isPrimaryButton = buttonIndex === 0;
		const isMiddleButton = buttonIndex === 1;

		if (isPrimaryButton || isMiddleButton) {
			const forceMove = isMiddleButton || altKey;

			const commandOrNull = this.resolveClick(target, position);
			const behavior = this.clickBehaviorResolver.resolve(commandOrNull, target, forceMove);
			const wrappedBehavior = this.clickBehaviorWrapper.wrap(behavior, commandOrNull);
			this.behaviorController.start(position, wrappedBehavior);
		}
	};

	private readonly onPinchToZoom = (distance: number, centerPoint: Vector) => {
		this.pinchToZoomController.start(distance, centerPoint);
	};

	private readonly onWheel = (e: WheelEvent) => {
		e.preventDefault();
		e.stopPropagation();

		this.wheelController.onWheel(e);
	};

	private readonly onContextMenu = (position: Vector, target: Element) => {
		const commandOrNull = this.resolveClick(target, position);
		this.contextMenuController.tryOpen(position, commandOrNull);
	};

	private readonly onViewportChanged = (viewport: Viewport) => {
		this.view.setPositionAndScale(viewport.position, viewport.scale);
	};

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
