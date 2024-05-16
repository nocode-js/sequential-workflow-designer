import { WorkspaceApi } from './api';
import { DesignerApi } from './api/designer-api';
import { ComponentContext } from './component-context';
import { Vector } from './core';
import { CustomActionController } from './custom-action-controller';
import { ComponentType, Sequence, Step } from './definition';
import { I18n } from './designer-configuration';
import {
	Badge,
	ClickCommand,
	ClickDetails,
	Component,
	Placeholder,
	PlaceholderDirection,
	SequenceComponent,
	StepComponentView
} from './workspace';

export interface DesignerExtension {
	steps?: StepExtension[];
	stepComponentViewWrapper?: StepComponentViewWrapperExtension;
	badges?: BadgeExtension[];
	uiComponents?: UiComponentExtension[];
	draggedComponent?: DraggedComponentExtension;
	wheelController?: WheelControllerExtension;
	viewportController?: ViewportControllerExtension;
	placeholderController?: PlaceholderControllerExtension;
	placeholder?: PlaceholderExtension;
	regionComponentView?: RegionComponentViewExtension;
	grid?: GridExtension;
	rootComponent?: RootComponentExtension;
	sequenceComponent?: SequenceComponentExtension;
	contextMenu?: ContextMenuExtension;
	daemons?: DaemonExtension[];
}

// StepExtension

export interface StepExtension<S extends Step = Step> {
	componentType: ComponentType;
	createComponentView(parentElement: SVGElement, stepContext: StepContext<S>, viewContext: StepComponentViewContext): StepComponentView;
}

export type StepComponentViewFactory = StepExtension['createComponentView'];

export interface StepComponentViewContext {
	i18n: I18n;
	getStepName(): string;
	getStepIconUrl(): string | null;
	createSequenceComponent(parentElement: SVGElement, sequence: Sequence): SequenceComponent;
	createPlaceholderForArea(
		parentElement: SVGElement,
		size: Vector,
		direction: PlaceholderDirection,
		sequence: Sequence,
		index: number
	): Placeholder;
	createRegionComponentView(
		parentElement: SVGElement,
		componentClassName: string,
		contentFactory: RegionComponentViewContentFactory
	): StepComponentView;
	getPreference(key: string): string | null;
	setPreference(key: string, value: string): void;
}

export interface StepContext<S extends Step = Step> {
	parentSequence: Sequence;
	step: S;
	depth: number;
	position: number;
	isInputConnected: boolean;
	isOutputConnected: boolean;
}

export interface SequenceContext {
	sequence: Sequence;
	depth: number;
	isInputConnected: boolean;
	isOutputConnected: boolean;
}

export interface StepComponentViewWrapperExtension {
	wrap(view: StepComponentView, stepContext: StepContext): StepComponentView;
}

// BadgeExtension

export interface BadgeExtension {
	id: string;
	createForStep(parentElement: SVGElement, view: StepComponentView, stepContext: StepContext, componentContext: ComponentContext): Badge;
	createForRoot?: (parentElement: SVGElement, componentContext: ComponentContext) => Badge;
	createStartValue(): unknown;
}

// WheelControllerExtension

export interface WheelControllerExtension {
	create(api: WorkspaceApi): WheelController;
}

export interface WheelController {
	onWheel(e: WheelEvent): void;
}

// UiComponentExtension

export interface UiComponentExtension {
	create(root: HTMLElement, api: DesignerApi): UiComponent;
}

export interface UiComponent {
	destroy(): void;
}

// DraggedComponentExtension

export interface DraggedComponentExtension {
	create(parentElement: HTMLElement, step: Step, componentContext: ComponentContext): DraggedComponent;
}

export interface DraggedComponent {
	width: number;
	height: number;
	destroy(): void;
}

// GridExtension

export interface GridExtension {
	create(): Grid;
}

export interface Grid {
	size: Vector;
	element: SVGElement;
	setScale(scale: number, scaledSize: Vector): void;
}

// RootComponentExtension

export interface RootComponentExtension {
	create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentPlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): Component;
}

export interface SequencePlaceIndicator {
	sequence: Sequence;
	index: number;
}

// SequenceComponentExtension

export interface SequenceComponentExtension {
	create(parentElement: SVGElement, sequenceContext: SequenceContext, componentContext: ComponentContext): SequenceComponent;
}

// ContextMenuExtension

export interface ContextMenuExtension {
	createItemsProvider?: (customActionController: CustomActionController) => ContextMenuItemsProvider;
}

export interface ContextMenuItemsProvider {
	getItems(step: Step | null, sequence: Sequence): ContextMenuItem[];
}

export interface ContextMenuItem {
	readonly label: string;
	readonly order: number;
	readonly callback?: () => void;
}

// PlaceholderControllerExtension

export interface PlaceholderControllerExtension {
	create(): PlaceholderController;
}

export interface PlaceholderController {
	canCreate(sequence: Sequence, index: number): boolean;
}

// PlaceholderExtension

export interface PlaceholderExtension {
	gapSize: Vector;
	createForGap(parentElement: SVGElement, sequence: Sequence, index: number): Placeholder;
	createForArea(parentElement: SVGElement, size: Vector, direction: PlaceholderDirection, sequence: Sequence, index: number): Placeholder;
}

// ViewportControllerExtension

export interface ViewportControllerExtension {
	create(api: WorkspaceApi): ViewportController;
}

export interface ViewportController {
	setDefault(): void;
	zoom(direction: boolean): void;
	focusOnComponent(componentPosition: Vector, componentSize: Vector): void;
}

export interface Viewport {
	readonly position: Vector;
	readonly scale: number;
}

// DaemonExtension

export interface DaemonExtension {
	create(api: DesignerApi): Daemon;
}

export interface Daemon {
	destroy(): void;
}

// RegionComponentViewExtension

export interface RegionView {
	getClientPosition(): Vector;
	/**
	 * @returns `true` if the click is inside the region, `null` if it's outside. The view may return a command to be executed.
	 */
	resolveClick(click: ClickDetails): true | ClickCommand | null;
	setIsSelected(isSelected: boolean): void;
}

export type RegionViewFactory = (parent: SVGElement, widths: number[], height: number) => RegionView;

export type RegionComponentViewContentFactory = (g: SVGGElement, regionViewFactory: RegionViewFactory) => StepComponentView;

export interface RegionComponentViewExtension {
	create(
		parentElement: SVGElement,
		componentClassName: string,
		stepContext: StepContext,
		viewContext: StepComponentViewContext,
		contentFactory: RegionComponentViewContentFactory
	): StepComponentView;
}
