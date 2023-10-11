import { ComponentType, Definition, DefinitionWalker, Sequence, Step } from './definition';
import { DesignerExtension } from './designer-extension';

export interface DesignerConfiguration<TDefinition extends Definition = Definition> {
	/**
	 * @description The theme of the designer.
	 * @default `light`
	 */
	theme?: string;

	/**
	 * @description The readonly mode of the designer.
	 */
	isReadonly?: boolean;

	/**
	 * @description The depth of the undo stack. If not set, undo/redo feature will be disabled.
	 */
	undoStackSize?: number;

	/**
	 * @description The initial undo stack. If not set, the undo stack will be empty.
	 */
	undoStack?: UndoStack;

	/**
	 * @description The common configuration of the steps.
	 */
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

	/**
	 * @description If false, the context menu will be disabled. By default, the context menu is enabled.
	 */
	contextMenu?: boolean;

	/**
	 * @description The configuration of validators.
	 */
	validator?: ValidatorConfiguration;

	/**
	 * @description The configuration of the keyboard shortcuts. By default, the keyboard shortcuts are enabled (`true`). If `false`, the keyboard shortcuts are disabled.
	 */
	keyboard?: boolean | KeyboardConfiguration;

	/**
	 * @description The handler that handles custom actions.
	 */
	customActionHandler?: CustomActionHandler;

	/**
	 * @description The extensions of the designer.
	 */
	extensions?: DesignerExtension[];

	/**
	 * @description Custom definition walker.
	 */
	definitionWalker?: DefinitionWalker;

	/**
	 * @description Custom generator of unique identifiers.
	 */
	uidGenerator?: UidGenerator;
}

export type UidGenerator = () => string;

export type CustomActionHandler = (
	action: CustomAction,
	step: Step | null,
	sequence: Sequence,
	context: CustomActionHandlerContext
) => void;

export interface CustomAction {
	type: string;
}

export interface CustomActionHandlerContext {
	/**
	 * @description Notifies the designer that the name of the step has changed.
	 * @param stepId The id of the step whose name has changed.
	 */
	notifyStepNameChanged(stepId: string): void;
	/**
	 * @description Notifies the designer that the properties of the step have changed.
	 * @param stepId The id of the step whose properties have changed.
	 */
	notifyStepPropertiesChanged(stepId: string): void;
	/**
	 * @description Notifies the designer that the step has been inserted.
	 * @param stepId The id of the inserted step.
	 */
	notifyStepInserted(stepId: string): void;
	/**
	 * @description Notifies the designer that the step has been moved.
	 * @param stepId The id of the moved step.
	 */
	notifyStepMoved(stepId: string): void;
	/**
	 * @description Notifies the designer that the step has been deleted.
	 * @param stepId The id of the deleted step.
	 */
	notifyStepDeleted(stepId: string): void;
}

export interface ToolboxConfiguration {
	labelProvider?: StepLabelProvider;
	descriptionProvider?: StepDescriptionProvider;
	isCollapsed?: boolean;
	groups: ToolboxGroupConfiguration[];
}

export type StepDefinition = Omit<Step, 'id'>;

export type StepLabelProvider = (step: StepDefinition) => string;
export type StepDescriptionProvider = (step: StepDefinition) => string;

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
	isDuplicable?: (step: Step, parentSequence: Sequence) => boolean;

	/**
	 * @description The designer automatically selects the step after it is dropped. If true, the step will not be selected.
	 */
	isAutoSelectDisabled?: boolean;

	iconUrlProvider?: StepIconUrlProvider;
}

export type StepIconUrlProvider = (componentType: ComponentType, type: string) => string | null;

export interface ValidatorConfiguration {
	step?: StepValidator;
	root?: RootValidator;
}

export type StepValidator = (step: Step, parentSequence: Sequence, definition: Definition) => boolean;
export type RootValidator = (definition: Definition) => boolean;

export interface KeyboardConfiguration {
	canHandleKey?: (action: KeyboardAction, event: KeyboardEvent) => boolean;
}

export enum KeyboardAction {
	delete = 'delete'
}

export interface EditorsConfiguration<TDefinition extends Definition = Definition> {
	isCollapsed?: boolean;
	stepEditorProvider: StepEditorProvider<TDefinition>;
	globalEditorProvider: GlobalEditorProvider<TDefinition>;
}

export interface StepEditorContext {
	notifyNameChanged(): void;
	notifyPropertiesChanged(): void;
	notifyChildrenChanged(): void;
}

export type StepEditorProvider<TDefinition extends Definition = Definition> = (
	step: Step,
	context: StepEditorContext,
	definition: TDefinition
) => HTMLElement;

// TODO: GlobalEditorContext should be renamed to RootEditorContext.
export interface GlobalEditorContext {
	notifyPropertiesChanged(): void;
}

export type RootEditorContext = GlobalEditorContext;

// TODO: GlobalEditorProvider should be renamed to RootEditorProvider.
export type GlobalEditorProvider<TDefinition extends Definition = Definition> = (
	definition: TDefinition,
	context: GlobalEditorContext
) => HTMLElement;

export type RootEditorProvider = GlobalEditorProvider;

export interface UndoStack {
	index: number;
	items: UndoStackItem[];
}

export interface UndoStackItem {
	definition: Definition;
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
