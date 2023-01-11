import ReactDOM from 'react-dom/client';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
	Definition,
	ToolboxConfiguration,
	Designer,
	GlobalEditorContext,
	Step,
	StepEditorContext,
	StepsConfiguration,
	DesignerExtension
} from 'sequential-workflow-designer';
import { GlobalEditorWrapperContext } from './GlobalEditorWrapper';
import { StepEditorWrapperContext } from './StepEditorWrapper';
import { wrapDefinition, WrappedDefinition } from './WrappedDefinition';

export interface SequentialWorkflowDesignerProps {
	definition: WrappedDefinition;
	onDefinitionChange: (state: WrappedDefinition) => void;
	selectedStepId?: string | null;
	onSelectedStepIdChanged?: (stepId: string | null) => void;
	isReadonly?: boolean;
	globalEditor: JSX.Element;
	stepEditor: JSX.Element;

	theme?: string;
	undoStackSize?: number;
	stepsConfiguration: StepsConfiguration;
	toolboxConfiguration: ToolboxConfiguration;
	extensions?: DesignerExtension[];
}

export function SequentialWorkflowDesigner(props: SequentialWorkflowDesignerProps) {
	const [placeholder, setPlaceholder] = useState<HTMLElement | null>(null);

	const onDefinitionChangeRef = useRef(props.onDefinitionChange);
	const onSelectedStepIdChangedRef = useRef(props.onSelectedStepIdChanged);
	const globalEditorRef = useRef(props.globalEditor);
	const stepEditorRef = useRef(props.stepEditor);

	const designerRef = useRef<Designer | null>(null);
	const editorRootRef = useRef<ReactDOM.Root | null>(null);

	const definition = props.definition;
	const selectedStepId = props.selectedStepId;
	const isReadonly = props.isReadonly;
	const theme = props.theme;
	const undoStackSize = props.undoStackSize;
	const stepsConfiguration = props.stepsConfiguration;
	const toolboxConfiguration = props.toolboxConfiguration;
	const extensions = props.extensions;

	function forwardDefinition() {
		if (designerRef.current) {
			const def = wrapDefinition(designerRef.current.getDefinition(), designerRef.current.isValid());
			onDefinitionChangeRef.current(def);
		}
	}

	function globalEditorProvider(def: Definition, context: GlobalEditorContext) {
		return editorProvider(
			editorRootRef,
			<GlobalEditorWrapperContext definition={def} context={context}>
				{globalEditorRef.current}
			</GlobalEditorWrapperContext>
		);
	}

	function stepEditorProvider(step: Step, context: StepEditorContext) {
		return editorProvider(
			editorRootRef,
			<StepEditorWrapperContext step={step} context={context}>
				{stepEditorRef.current}
			</StepEditorWrapperContext>
		);
	}

	useEffect(() => {
		onDefinitionChangeRef.current = props.onDefinitionChange;
	}, [props.onDefinitionChange]);

	useEffect(() => {
		onSelectedStepIdChangedRef.current = props.onSelectedStepIdChanged;
	}, [props.onSelectedStepIdChanged]);

	useEffect(() => {
		globalEditorRef.current = props.globalEditor;
	}, [props.globalEditor]);

	useEffect(() => {
		stepEditorRef.current = props.stepEditor;
	}, [props.stepEditor]);

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
					// console.log('sqd: readonly updated');
				}
				return;
			}

			designerRef.current.destroy();
			designerRef.current = null;
		}

		const designer = Designer.create(placeholder, definition.value, {
			theme,
			undoStackSize,
			toolbox: toolboxConfiguration,
			steps: stepsConfiguration,
			editors: {
				isHidden: false,
				globalEditorProvider,
				stepEditorProvider
			},
			extensions
		});
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

		designerRef.current = designer;
	}, [placeholder, definition, selectedStepId, isReadonly, theme, undoStackSize, toolboxConfiguration, stepsConfiguration, extensions]);

	useEffect(() => {
		return () => {
			if (editorRootRef.current) {
				const oldRoot = editorRootRef.current;
				editorRootRef.current = null;
				setTimeout(() => oldRoot.unmount());
			}
			if (designerRef.current) {
				designerRef.current.destroy();
				designerRef.current = null;
				// console.log('sqd: designer destroyed');
			}
		};
	}, []);

	return <div ref={setPlaceholder} className="sqd-designer-react"></div>;
}

function editorProvider(rootRef: MutableRefObject<ReactDOM.Root | null>, element: JSX.Element): HTMLElement {
	if (rootRef.current) {
		const oldRoot = rootRef.current;
		rootRef.current = null;
		setTimeout(() => oldRoot.unmount());
	}

	const container = document.createElement('div');
	container.className = 'sqd-editor-react';
	rootRef.current = ReactDOM.createRoot(container);
	rootRef.current.render(element);
	return container;
}
