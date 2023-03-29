import { ComponentType, Definition, Sequence, Step } from './definition';
import { DesignerExtension } from './designer-extension';

export interface DesignerConfiguration<TDefinition extends Definition = Definition> {
	/**
	 * @description The theme of the designer.
	 * @default `light`
	 */
	theme?: string;
	isReadonly?: boolean;
	undoStackSize?: number;
	steps: StepsConfiguration;

	/**
	 * @description The configuration of the toolbox. If not set, the toolbox will be hidden.
	 */
	toolbox: false | ToolboxConfiguration;

	/**
	 * @description The configuration of the smart editor. If not set, the smart editor will be hidden.
	 */
	editors: false | EditorsConfiguration<TDefinition>;

	/**
	 * @description If true, the control bar will be displayed. In the next version, this property will be required.
	 */
	controlBar: boolean;

	customActionHandler?: CustomActionHandler;

	extensions?: DesignerExtension[];
}

export type CustomActionHandler = (action: string, step: Step | null, sequence: Sequence) => void;

export interface ToolboxConfiguration {
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

export interface EditorsConfiguration<TDefinition extends Definition = Definition> {
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

export type GlobalEditorProvider<TDefinition extends Definition = Definition> = (
	definition: TDefinition,
	context: GlobalEditorContext
) => HTMLElement;
