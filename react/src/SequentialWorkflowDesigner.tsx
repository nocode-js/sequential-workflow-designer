import ReactDOM from 'react-dom/client';
import { useEffect, useRef, useState, isValidElement } from 'react';
import {
	Definition,
	ToolboxConfiguration,
	Designer,
	RootEditorContext,
	Step,
	StepEditorContext,
	StepsConfiguration,
	DesignerExtension,
	CustomActionHandler,
	CustomActionHandlerContext,
	CustomAction,
	Sequence,
	ValidatorConfiguration,
	RootEditorProvider,
	StepEditorProvider,
	KeyboardConfiguration,
	I18n,
	PreferenceStorage,
	PlaceholderConfiguration
} from 'sequential-workflow-designer';
import { RootEditorWrapperContext } from './RootEditorWrapper';
import { StepEditorWrapperContext } from './StepEditorWrapper';
import { wrapDefinition, WrappedDefinition } from './WrappedDefinition';
import { Presenter } from './core/Presenter';
import { SequentialWorkflowDesignerController } from './SequentialWorkflowDesignerController';

const externalEditorClassName = 'sqd-editor-react';

export type ReactToolboxConfiguration = Omit<ToolboxConfiguration, 'isCollapsed'>;

export interface SequentialWorkflowDesignerProps<TDefinition extends Definition> {
	definition: WrappedDefinition<TDefinition>;
	onDefinitionChange: (state: WrappedDefinition<TDefinition>) => void;
	selectedStepId?: string | null;
	onSelectedStepIdChanged?: (stepId: string | null) => void;
	onStepUnselectionBlocked?: (targetStepId: string | null) => void;
	isReadonly?: boolean;

	rootEditor: false | JSX.Element | RootEditorProvider;
	stepEditor: false | JSX.Element | StepEditorProvider;
	isEditorCollapsed?: boolean;
	onIsEditorCollapsedChanged?: (isCollapsed: boolean) => void;

	theme?: string;
	undoStackSize?: number;
	stepsConfiguration: StepsConfiguration;
	validatorConfiguration?: ValidatorConfiguration;
	placeholderConfiguration?: PlaceholderConfiguration;
	toolboxConfiguration: false | ReactToolboxConfiguration;
	isToolboxCollapsed?: boolean;
	onIsToolboxCollapsedChanged?: (isCollapsed: boolean) => void;
	/**
	 * @description If true, the control bar will be displayed.
	 */
	controlBar: boolean;
	contextMenu?: boolean;
	keyboard?: boolean | KeyboardConfiguration;
	preferenceStorage?: PreferenceStorage;
	controller?: SequentialWorkflowDesignerController;
	customActionHandler?: CustomActionHandler;
	extensions?: DesignerExtension[];
	i18n?: I18n;
}

export function SequentialWorkflowDesigner<TDefinition extends Definition>(props: SequentialWorkflowDesignerProps<TDefinition>) {
	const [root, setRoot] = useState<HTMLElement | null>(null);

	const onDefinitionChangeRef = useRef(props.onDefinitionChange);
	const onSelectedStepIdChangedRef = useRef(props.onSelectedStepIdChanged);
	const onStepUnselectionBlockedRef = useRef(props.onStepUnselectionBlocked);
	const onIsEditorCollapsedChangedRef = useRef(props.onIsEditorCollapsedChanged);
	const onIsToolboxCollapsedChangedRef = useRef(props.onIsToolboxCollapsedChanged);
	const rootEditorRef = useRef(props.rootEditor);
	const stepEditorRef = useRef(props.stepEditor);
	const controllerRef = useRef(props.controller);
	const customActionHandlerRef = useRef(props.customActionHandler);

	const designerRef = useRef<Designer<TDefinition> | null>(null);
	const editorRootRef = useRef<ReactDOM.Root | null>(null);

	const definition = props.definition;
	const selectedStepId = props.selectedStepId;
	const isReadonly = props.isReadonly;
	const theme = props.theme;
	const undoStackSize = props.undoStackSize;
	const steps = props.stepsConfiguration;
	const validator = props.validatorConfiguration;
	const placeholder = props.placeholderConfiguration;
	const toolbox = props.toolboxConfiguration;
	const isEditorCollapsed = props.isEditorCollapsed;
	const isToolboxCollapsed = props.isToolboxCollapsed;
	const controlBar = props.controlBar;
	const contextMenu = props.contextMenu;
	const keyboard = props.keyboard;
	const preferenceStorage = props.preferenceStorage;
	const extensions = props.extensions;
	const i18n = props.i18n;

	function forwardDefinition() {
		if (designerRef.current) {
			const wd = wrapDefinition(designerRef.current.getDefinition(), designerRef.current.isValid());
			onDefinitionChangeRef.current(wd);
		}
	}

	function rootEditorProvider(def: TDefinition, context: RootEditorContext, isReadonly: boolean) {
		if (!rootEditorRef.current) {
			throw new Error('Root editor is not provided');
		}
		if (isValidElement(rootEditorRef.current)) {
			return Presenter.render(
				externalEditorClassName,
				editorRootRef,
				<RootEditorWrapperContext definition={def} context={context} isReadonly={isReadonly}>
					{rootEditorRef.current}
				</RootEditorWrapperContext>
			);
		}
		return (rootEditorRef.current as RootEditorProvider)(def, context, isReadonly);
	}

	function stepEditorProvider(step: Step, context: StepEditorContext, def: Definition, isReadonly: boolean) {
		if (!stepEditorRef.current) {
			throw new Error('Step editor is not provided');
		}
		if (isValidElement(stepEditorRef.current)) {
			return Presenter.render(
				externalEditorClassName,
				editorRootRef,
				<StepEditorWrapperContext step={step} definition={def} context={context} isReadonly={isReadonly}>
					{stepEditorRef.current}
				</StepEditorWrapperContext>
			);
		}
		return (stepEditorRef.current as StepEditorProvider)(step, context, def, isReadonly);
	}

	function customActionHandler(action: CustomAction, step: Step | null, sequence: Sequence, context: CustomActionHandlerContext) {
		if (customActionHandlerRef.current) {
			customActionHandlerRef.current(action, step, sequence, context);
		}
	}

	function tryDestroy() {
		Presenter.tryDestroy(editorRootRef);

		if (controllerRef.current) {
			controllerRef.current.setDesigner(null);
		}
		if (designerRef.current) {
			designerRef.current.destroy();
			designerRef.current = null;
			// console.log('sqd: designer destroyed');
		}
	}

	useEffect(() => {
		onDefinitionChangeRef.current = props.onDefinitionChange;
	}, [props.onDefinitionChange]);

	useEffect(() => {
		onSelectedStepIdChangedRef.current = props.onSelectedStepIdChanged;
	}, [props.onSelectedStepIdChanged]);

	useEffect(() => {
		onStepUnselectionBlockedRef.current = props.onStepUnselectionBlocked;
	}, [props.onStepUnselectionBlocked]);

	useEffect(() => {
		onIsEditorCollapsedChangedRef.current = props.onIsEditorCollapsedChanged;
	}, [props.onIsEditorCollapsedChanged]);

	useEffect(() => {
		onIsToolboxCollapsedChangedRef.current = props.onIsToolboxCollapsedChanged;
	}, [props.onIsToolboxCollapsedChanged]);

	useEffect(() => {
		rootEditorRef.current = props.rootEditor;
	}, [props.rootEditor]);

	useEffect(() => {
		stepEditorRef.current = props.stepEditor;
	}, [props.stepEditor]);

	useEffect(() => {
		customActionHandlerRef.current = props.customActionHandler;
	}, [props.customActionHandler]);

	useEffect(() => {
		if (!root) {
			return;
		}

		if (designerRef.current) {
			const isNotChanged = definition.value === designerRef.current.getDefinition();
			if (isNotChanged) {
				if (selectedStepId !== undefined && selectedStepId !== designerRef.current.getSelectedStepId()) {
					if (selectedStepId) {
						designerRef.current.selectStepById(selectedStepId);
					} else {
						designerRef.current.clearSelectedStep();
					}
					// console.log('sqd: selected step updated');
				}

				if (isReadonly !== undefined && isReadonly !== designerRef.current.isReadonly()) {
					designerRef.current.setIsReadonly(isReadonly);
					// console.log('sqd: isReadonly updated');
				}
				if (isToolboxCollapsed !== undefined && isToolboxCollapsed !== designerRef.current.isToolboxCollapsed()) {
					designerRef.current.setIsToolboxCollapsed(isToolboxCollapsed);
					// console.log('sqd: isToolboxCollapsed updated');
				}
				if (isEditorCollapsed !== undefined && isEditorCollapsed !== designerRef.current.isEditorCollapsed()) {
					designerRef.current.setIsEditorCollapsed(isEditorCollapsed);
					// console.log('sqd: isEditorCollapsed updated');
				}
				return;
			}

			tryDestroy();
		}

		const designer = Designer.create(root, definition.value, {
			theme,
			undoStackSize,
			toolbox: toolbox
				? {
						...toolbox,
						isCollapsed: isToolboxCollapsed
					}
				: false,
			steps,
			validator,
			placeholder,
			controlBar,
			contextMenu,
			keyboard,
			preferenceStorage,
			editors:
				rootEditorRef.current && stepEditorRef.current
					? {
							isCollapsed: isEditorCollapsed,
							rootEditorProvider,
							stepEditorProvider
						}
					: false,
			customActionHandler: customActionHandlerRef.current && customActionHandler,
			extensions,
			i18n,
			isReadonly
		});
		if (controllerRef.current) {
			controllerRef.current.setDesigner(designer as unknown as Designer<Definition>);
		}
		if (selectedStepId) {
			designer.selectStepById(selectedStepId);
		}
		// console.log('sqd: designer rendered');

		designer.onReady.subscribe(forwardDefinition);
		designer.onDefinitionChanged.subscribe(forwardDefinition);

		designer.onSelectedStepIdChanged.subscribe(stepId => {
			if (onSelectedStepIdChangedRef.current) {
				onSelectedStepIdChangedRef.current(stepId);
			}
		});
		designer.onStepUnselectionBlocked.subscribe(targetStepId => {
			if (onStepUnselectionBlockedRef.current) {
				onStepUnselectionBlockedRef.current(targetStepId);
			}
		});
		designer.onIsToolboxCollapsedChanged.subscribe(isCollapsed => {
			if (onIsToolboxCollapsedChangedRef.current) {
				onIsToolboxCollapsedChangedRef.current(isCollapsed);
			}
		});
		designer.onIsEditorCollapsedChanged.subscribe(isCollapsed => {
			if (onIsEditorCollapsedChangedRef.current) {
				onIsEditorCollapsedChangedRef.current(isCollapsed);
			}
		});

		designerRef.current = designer;
	}, [
		root,
		definition,
		selectedStepId,
		isReadonly,
		theme,
		undoStackSize,
		toolbox,
		isToolboxCollapsed,
		isEditorCollapsed,
		contextMenu,
		keyboard,
		preferenceStorage,
		controlBar,
		steps,
		validator,
		placeholder,
		extensions,
		i18n
	]);

	useEffect(() => {
		return tryDestroy;
	}, []);

	return <div ref={setRoot} data-testid="designer" className="sqd-designer-react"></div>;
}
