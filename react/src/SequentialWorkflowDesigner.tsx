import ReactDOM from 'react-dom/client';
import { useEffect, useRef, useState, isValidElement } from 'react';
import {
	Definition,
	ToolboxConfiguration,
	Designer,
	GlobalEditorContext,
	Step,
	StepEditorContext,
	StepsConfiguration,
	DesignerExtension,
	CustomActionHandler,
	CustomActionHandlerContext,
	CustomAction,
	Sequence,
	ValidatorConfiguration,
	GlobalEditorProvider,
	StepEditorProvider
} from 'sequential-workflow-designer';
import { GlobalEditorWrapperContext } from './GlobalEditorWrapper';
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
	isReadonly?: boolean;

	globalEditor: false | JSX.Element | GlobalEditorProvider;
	stepEditor: false | JSX.Element | StepEditorProvider;
	isEditorCollapsed?: boolean;
	onIsEditorCollapsedChanged?: (isCollapsed: boolean) => void;

	theme?: string;
	undoStackSize?: number;
	stepsConfiguration: StepsConfiguration;
	validatorConfiguration?: ValidatorConfiguration;
	toolboxConfiguration: false | ReactToolboxConfiguration;
	isToolboxCollapsed?: boolean;
	onIsToolboxCollapsedChanged?: (isCollapsed: boolean) => void;
	/**
	 * @description If true, the control bar will be displayed.
	 */
	controlBar: boolean;
	controller?: SequentialWorkflowDesignerController;
	customActionHandler?: CustomActionHandler;
	extensions?: DesignerExtension[];
}

export function SequentialWorkflowDesigner<TDefinition extends Definition>(props: SequentialWorkflowDesignerProps<TDefinition>) {
	const [placeholder, setPlaceholder] = useState<HTMLElement | null>(null);

	const onDefinitionChangeRef = useRef(props.onDefinitionChange);
	const onSelectedStepIdChangedRef = useRef(props.onSelectedStepIdChanged);
	const onIsEditorCollapsedChangedRef = useRef(props.onIsEditorCollapsedChanged);
	const onIsToolboxCollapsedChangedRef = useRef(props.onIsToolboxCollapsedChanged);
	const globalEditorRef = useRef(props.globalEditor);
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
	const toolbox = props.toolboxConfiguration;
	const isEditorCollapsed = props.isEditorCollapsed;
	const isToolboxCollapsed = props.isToolboxCollapsed;
	const controlBar = props.controlBar;
	const extensions = props.extensions;

	if (props.controlBar === undefined) {
		throw new Error('The "controlBar" property is not set');
	}

	function forwardDefinition() {
		if (designerRef.current) {
			const def = wrapDefinition(designerRef.current.getDefinition(), designerRef.current.isValid());
			onDefinitionChangeRef.current(def);
		}
	}

	function globalEditorProvider(def: TDefinition, context: GlobalEditorContext) {
		if (!globalEditorRef.current) {
			throw new Error('Global editor is not provided');
		}
		if (isValidElement(globalEditorRef.current)) {
			return Presenter.render(
				externalEditorClassName,
				editorRootRef,
				<GlobalEditorWrapperContext definition={def} context={context}>
					{globalEditorRef.current}
				</GlobalEditorWrapperContext>
			);
		}
		return (globalEditorRef.current as GlobalEditorProvider)(def, context);
	}

	function stepEditorProvider(step: Step, context: StepEditorContext) {
		if (!stepEditorRef.current) {
			throw new Error('Step editor is not provided');
		}
		if (isValidElement(stepEditorRef.current)) {
			return Presenter.render(
				externalEditorClassName,
				editorRootRef,
				<StepEditorWrapperContext step={step} context={context}>
					{stepEditorRef.current}
				</StepEditorWrapperContext>
			);
		}
		return (stepEditorRef.current as StepEditorProvider)(step, context);
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
		onIsEditorCollapsedChangedRef.current = props.onIsEditorCollapsedChanged;
	}, [props.onIsEditorCollapsedChanged]);

	useEffect(() => {
		onIsToolboxCollapsedChangedRef.current = props.onIsToolboxCollapsedChanged;
	}, [props.onIsToolboxCollapsedChanged]);

	useEffect(() => {
		globalEditorRef.current = props.globalEditor;
	}, [props.globalEditor]);

	useEffect(() => {
		stepEditorRef.current = props.stepEditor;
	}, [props.stepEditor]);

	useEffect(() => {
		customActionHandlerRef.current = props.customActionHandler;
	}, [props.customActionHandler]);

	useEffect(() => {
		if (!placeholder) {
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

		const designer = Designer.create(placeholder, definition.value, {
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
			controlBar,
			editors:
				globalEditorRef.current && stepEditorRef.current
					? {
							isCollapsed: isEditorCollapsed,
							globalEditorProvider,
							stepEditorProvider
					  }
					: false,
			customActionHandler: customActionHandlerRef.current && customActionHandler,
			extensions
		});
		if (controllerRef.current) {
			controllerRef.current.setDesigner(designer);
		}
		if (selectedStepId) {
			designer.selectStepById(selectedStepId);
		}
		if (isReadonly) {
			designer.setIsReadonly(isReadonly);
		}
		// console.log('sqd: designer rendered');

		designer.onReady.subscribe(forwardDefinition);
		designer.onDefinitionChanged.subscribe(forwardDefinition);

		designer.onSelectedStepIdChanged.subscribe(stepId => {
			if (onSelectedStepIdChangedRef.current) {
				onSelectedStepIdChangedRef.current(stepId);
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
		placeholder,
		definition,
		selectedStepId,
		isReadonly,
		theme,
		undoStackSize,
		toolbox,
		isToolboxCollapsed,
		isEditorCollapsed,
		controlBar,
		steps,
		validator,
		extensions
	]);

	useEffect(() => {
		return tryDestroy;
	}, []);

	return <div ref={setPlaceholder} data-testid="designer" className="sqd-designer-react"></div>;
}
