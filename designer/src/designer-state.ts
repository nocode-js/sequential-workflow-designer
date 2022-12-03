import { SimpleEvent } from './core/simple-event';
import { Vector } from './core/vector';
import { Definition, Step } from './definition';

export interface DefinitionChangedEvent {
	changeType: DefinitionChangeType;
	stepId: string | null;
}

export enum DefinitionChangeType {
	stepNameChanged = 1,
	stepPropertyChanged,
	stepChildrenChanged,
	stepDeleted,
	stepMoved,
	stepInserted,
	globalPropertyChanged,
	rootReplaced
}

export interface ViewPort {
	position: Vector;
	scale: number;
}

export class DesignerState {
	public readonly onViewPortChanged = new SimpleEvent<ViewPort>();
	public readonly onSelectedStepChanged = new SimpleEvent<Step | null>();
	public readonly onIsReadonlyChanged = new SimpleEvent<boolean>();
	public readonly onIsDraggingChanged = new SimpleEvent<boolean>();
	public readonly onIsMoveModeEnabledChanged = new SimpleEvent<boolean>();
	public readonly onIsToolboxCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onIsSmartEditorCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onDefinitionChanged = new SimpleEvent<DefinitionChangedEvent>();

	public viewPort: ViewPort = {
		position: new Vector(0, 0),
		scale: 1
	};
	public selectedStep: Step | null = null;
	public isDragging = false;
	public isMoveModeEnabled = false;

	public constructor(
		public definition: Definition,
		public isReadonly: boolean,
		public isToolboxCollapsed: boolean,
		public isSmartEditorCollapsed: boolean
	) {}

	public setViewPort(position: Vector, scale: number) {
		this.viewPort = { position, scale };
		this.onViewPortChanged.forward(this.viewPort);
	}

	public setSelectedStep(step: Step | null) {
		if (this.selectedStep !== step) {
			this.selectedStep = step;
			this.onSelectedStepChanged.forward(step);
		}
	}

	public setIsReadonly(isReadonly: boolean) {
		if (this.isReadonly !== isReadonly) {
			this.isReadonly = isReadonly;
			this.onIsReadonlyChanged.forward(isReadonly);
		}
	}

	public setIsDragging(isDragging: boolean) {
		if (this.isDragging !== isDragging) {
			this.isDragging = isDragging;
			this.onIsDraggingChanged.forward(isDragging);
		}
	}

	public toggleIsMoveModeEnabled() {
		this.isMoveModeEnabled = !this.isMoveModeEnabled;
		this.onIsMoveModeEnabledChanged.forward(this.isMoveModeEnabled);
	}

	public toggleIsToolboxCollapsed() {
		this.isToolboxCollapsed = !this.isToolboxCollapsed;
		this.onIsToolboxCollapsedChanged.forward(this.isToolboxCollapsed);
	}

	public toggleIsSmartEditorCollapsed() {
		this.isSmartEditorCollapsed = !this.isSmartEditorCollapsed;
		this.onIsSmartEditorCollapsedChanged.forward(this.isSmartEditorCollapsed);
	}

	public setDefinition(definition: Definition) {
		this.definition = definition;
		this.notifyDefinitionChanged(DefinitionChangeType.rootReplaced, null);
	}

	public notifyDefinitionChanged(changeType: DefinitionChangeType, stepId: string | null) {
		this.onDefinitionChanged.forward({ changeType, stepId });
	}
}
