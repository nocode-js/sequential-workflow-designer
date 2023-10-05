import { SimpleEvent } from './core/simple-event';
import { Vector } from './core/vector';
import { Definition } from './definition';
import { DefinitionChangeType } from './designer-configuration';
import { Viewport } from './designer-extension';

export interface DefinitionChangedEvent {
	changeType: DefinitionChangeType;
	stepId: string | null;
}

export class DesignerState {
	public readonly onViewportChanged = new SimpleEvent<Viewport>();
	public readonly onSelectedStepIdChanged = new SimpleEvent<string | null>();
	public readonly onFolderPathChanged = new SimpleEvent<string[]>();
	public readonly onIsReadonlyChanged = new SimpleEvent<boolean>();
	public readonly onIsDraggingChanged = new SimpleEvent<boolean>();
	public readonly onIsDragDisabledChanged = new SimpleEvent<boolean>();
	public readonly onDefinitionChanged = new SimpleEvent<DefinitionChangedEvent>();
	public readonly onIsToolboxCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onIsEditorCollapsedChanged = new SimpleEvent<boolean>();

	public viewport: Viewport = {
		position: new Vector(0, 0),
		scale: 1
	};
	public selectedStepId: string | null = null;
	public folderPath: string[] = [];
	public isDragging = false;
	public isDragDisabled = false;

	public constructor(
		public definition: Definition,
		public isReadonly: boolean,
		public isToolboxCollapsed: boolean,
		public isEditorCollapsed: boolean
	) {}

	public setSelectedStepId(stepId: string | null) {
		if (this.selectedStepId !== stepId) {
			this.selectedStepId = stepId;
			this.onSelectedStepIdChanged.forward(stepId);
		}
	}

	public pushStepIdToFolderPath(stepId: string) {
		this.folderPath.push(stepId);
		this.onFolderPathChanged.forward(this.folderPath);
	}

	public setFolderPath(path: string[]) {
		this.folderPath = path;
		this.onFolderPathChanged.forward(path);
	}

	public tryGetLastStepIdFromFolderPath(): string | null {
		return this.folderPath.length > 0 ? this.folderPath[this.folderPath.length - 1] : null;
	}

	public setDefinition(definition: Definition) {
		this.definition = definition;
		this.notifyDefinitionChanged(DefinitionChangeType.rootReplaced, null);
	}

	public notifyDefinitionChanged(changeType: DefinitionChangeType, stepId: string | null) {
		this.onDefinitionChanged.forward({ changeType, stepId });
	}

	public setViewport(viewport: Viewport) {
		this.viewport = viewport;
		this.onViewportChanged.forward(viewport);
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

	public toggleIsDragDisabled() {
		this.isDragDisabled = !this.isDragDisabled;
		this.onIsDragDisabledChanged.forward(this.isDragDisabled);
	}

	public setIsToolboxCollapsed(isCollapsed: boolean) {
		if (this.isToolboxCollapsed !== isCollapsed) {
			this.isToolboxCollapsed = isCollapsed;
			this.onIsToolboxCollapsedChanged.forward(isCollapsed);
		}
	}

	public setIsEditorCollapsed(isCollapsed: boolean) {
		if (this.isEditorCollapsed !== isCollapsed) {
			this.isEditorCollapsed = isCollapsed;
			this.onIsEditorCollapsedChanged.forward(isCollapsed);
		}
	}
}
