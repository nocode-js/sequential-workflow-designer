import { ComponentType, Definition, Sequence, Step } from './definition';
import { DesignerExtension } from './designer-extension';

export interface DesignerConfiguration<TDefinition extends Definition = Definition> {
	theme?: string;
	isReadonly?: boolean;
	undoStackSize?: number;

	toolbox: ToolboxConfiguration;
	steps: StepsConfiguration;
	editors: EditorsConfiguration<TDefinition>;

	extensions?: DesignerExtension[];
}

export interface ToolboxConfiguration {
	isHidden?: boolean;
	groups: ToolboxGroupConfiguration[];
}

export type StepDefinition = Omit<Step, 'id'>;

export interface ToolboxGroupConfiguration {
	name: string;
	steps: StepDefinition[];
}

export interface StepsConfiguration {
	canInsertStep?: (step: Step, targetSequence: Sequence, targetIndex: number) => boolean;
	isDraggable?: (step: Step, parentSequence: Sequence) => boolean;
	canMoveStep?: (sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number) => boolean;
	isDeletable?: (step: Step, parentSequence: Sequence) => boolean;
	canDeleteStep?: (step: Step, parentSequence: Sequence) => boolean;

	iconUrlProvider?: StepIconUrlProvider;
	validator?: StepValidator;
}

export type StepIconUrlProvider = (componentType: ComponentType, type: string) => string | null;

export type StepValidator = (step: Step, parentSequence: Sequence) => boolean;

export interface EditorsConfiguration<TDefinition extends Definition> {
	isHidden?: boolean;
	stepEditorProvider: StepEditorProvider;
	globalEditorProvider: GlobalEditorProvider<TDefinition>;
}

export interface StepEditorContext {
	notifyNameChanged(): void;
	notifyPropertiesChanged(): void;
	notifyChildrenChanged(): void;
}

export type StepEditorProvider = (step: Step, context: StepEditorContext) => HTMLElement;

export interface GlobalEditorContext {
	notifyPropertiesChanged(): void;
}

export type GlobalEditorProvider<TDefinition extends Definition> = (definition: TDefinition, context: GlobalEditorContext) => HTMLElement;
