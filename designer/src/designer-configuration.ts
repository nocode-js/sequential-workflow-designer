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
	 * @description The configuration of validators.
	 */
	validator?: ValidatorConfiguration;

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
	isCollapsed?: boolean;
	groups: ToolboxGroupConfiguration[];
}

export type StepDefinition = Omit<Step, 'id'>;

export type StepLabelProvider = (step: StepDefinition) => string;

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
}

export type StepIconUrlProvider = (componentType: ComponentType, type: string) => string | null;

export interface ValidatorConfiguration {
	step?: StepValidator;
	root?: RootValidator;
}

export type StepValidator = (step: Step, parentSequence: Sequence, definition: Definition) => boolean;
export type RootValidator = (definition: Definition) => boolean;

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

export interface GlobalEditorContext {
	notifyPropertiesChanged(): void;
}

export type GlobalEditorProvider<TDefinition extends Definition = Definition> = (
	definition: TDefinition,
	context: GlobalEditorContext
) => HTMLElement;
