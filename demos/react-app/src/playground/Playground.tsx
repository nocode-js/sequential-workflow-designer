import { useEffect, useMemo, useState } from 'react';
import {
	ObjectCloner,
	PlaceholderConfiguration,
	Step,
	StepsConfiguration,
	ToolboxConfiguration,
	ValidatorConfiguration
} from 'sequential-workflow-designer';
import { SequentialWorkflowDesigner, wrapDefinition } from 'sequential-workflow-designer-react';
import { RootEditor } from './RootEditor';
import { StepEditor } from './StepEditor';
import { createSwitchStep, createTaskStep } from './StepUtils';
import { useSequentialWorkflowDesignerController } from 'sequential-workflow-designer-react';
import { WorkflowDefinition } from './model';

const startDefinition: WorkflowDefinition = {
	properties: {
		alfa: 'bravo'
	},
	sequence: [createTaskStep(), createSwitchStep()]
};

export function Playground() {
	const controller = useSequentialWorkflowDesignerController();
	const toolboxConfiguration: ToolboxConfiguration = useMemo(
		() => ({
			groups: [{ name: 'Steps', steps: [createTaskStep(), createSwitchStep()] }]
		}),
		[]
	);
	const stepsConfiguration: StepsConfiguration = useMemo(
		() => ({
			iconUrlProvider: () => null
		}),
		[]
	);
	const validatorConfiguration: ValidatorConfiguration = useMemo(
		() => ({
			step: (step: Step) => Boolean(step.name),
			root: (definition: WorkflowDefinition) => Boolean(definition.properties.alfa)
		}),
		[]
	);
	const placeholderConfiguration: PlaceholderConfiguration = useMemo(
		() => ({
			canShow() {
				return true;
			}
		}),
		[]
	);

	const [isVisible, setIsVisible] = useState(true);
	const [isToolboxCollapsed, setIsToolboxCollapsed] = useState(false);
	const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
	const [definition, setDefinition] = useState(() => wrapDefinition(startDefinition));
	const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
	const [isReadonly, setIsReadonly] = useState(false);
	const [moveViewportToStep, setMoveViewportToStep] = useState<string | null>(null);
	const definitionJson = JSON.stringify(definition.value, null, 2);

	useEffect(() => {
		function onIsReadyChanged() {
			console.log(`isReady=${controller.isReady()}`);
		}
		controller.onIsReadyChanged.subscribe(onIsReadyChanged);
		return () => {
			controller.onIsReadyChanged.unsubscribe(onIsReadyChanged);
		};
	}, [controller]);

	useEffect(() => {
		console.log(`definition updated, isValid=${definition.isValid}`);
	}, [definition]);

	useEffect(() => {
		if (moveViewportToStep) {
			if (controller.isReady()) {
				controller.moveViewportToStep(moveViewportToStep);
			}
			setMoveViewportToStep(null);
		}
	}, [controller, moveViewportToStep]);

	function toggleVisibilityClicked() {
		setIsVisible(!isVisible);
	}

	function toggleSelectionClicked() {
		const id = definition.value.sequence[0].id;
		setSelectedStepId(selectedStepId ? null : id);
	}

	function toggleIsReadonlyClicked() {
		setIsReadonly(!isReadonly);
	}

	function toggleToolboxClicked() {
		setIsToolboxCollapsed(!isToolboxCollapsed);
	}

	function toggleEditorClicked() {
		setIsEditorCollapsed(!isEditorCollapsed);
	}

	function moveViewportToFirstStepClicked() {
		const fistStep = definition.value.sequence[0];
		if (fistStep) {
			setMoveViewportToStep(fistStep.id);
		}
	}

	async function appendStepClicked() {
		const newStep = createTaskStep();

		const newDefinition = ObjectCloner.deepClone(definition.value);
		newDefinition.sequence.push(newStep);
		// We need to wait for the controller to finish the operation before we can select the new step
		await controller.replaceDefinition(newDefinition);

		setSelectedStepId(newStep.id);
		setMoveViewportToStep(newStep.id);
	}

	function reloadDefinitionClicked() {
		const newDefinition = ObjectCloner.deepClone(startDefinition);
		setSelectedStepId(null);
		setDefinition(wrapDefinition(newDefinition));
	}

	function yesOrNo(value: boolean) {
		return value ? '✅ Yes' : '⛔ No';
	}

	return (
		<>
			<div className="designer">
				{isVisible && (
					<SequentialWorkflowDesigner
						undoStackSize={10}
						theme="soft"
						definition={definition}
						onDefinitionChange={setDefinition}
						selectedStepId={selectedStepId}
						isReadonly={isReadonly}
						onSelectedStepIdChanged={setSelectedStepId}
						toolboxConfiguration={toolboxConfiguration}
						isToolboxCollapsed={isToolboxCollapsed}
						onIsToolboxCollapsedChanged={setIsToolboxCollapsed}
						stepsConfiguration={stepsConfiguration}
						validatorConfiguration={validatorConfiguration}
						placeholderConfiguration={placeholderConfiguration}
						controlBar={true}
						rootEditor={<RootEditor />}
						stepEditor={<StepEditor />}
						isEditorCollapsed={isEditorCollapsed}
						onIsEditorCollapsedChanged={setIsEditorCollapsed}
						controller={controller}
					/>
				)}
			</div>
			<div className="sidebar">
				<ul>
					<li>Definition: {definitionJson.length} bytes</li>
					<li>Selected step: {selectedStepId}</li>
					<li>Is readonly: {yesOrNo(isReadonly)}</li>
					<li>Is valid: {definition.isValid === undefined ? '?' : yesOrNo(definition.isValid)}</li>
					<li>Is toolbox collapsed: {yesOrNo(isToolboxCollapsed)}</li>
					<li>Is editor collapsed: {yesOrNo(isEditorCollapsed)}</li>
				</ul>

				<div>
					<button onClick={toggleVisibilityClicked}>Toggle visibility</button>
					<button onClick={reloadDefinitionClicked}>Reload definition</button>
					<button onClick={toggleSelectionClicked}>Toggle selection</button>
					<button onClick={toggleIsReadonlyClicked}>Toggle readonly</button>
					<button onClick={toggleToolboxClicked}>Toggle toolbox</button>
					<button onClick={toggleEditorClicked}>Toggle editor</button>
					<button onClick={moveViewportToFirstStepClicked}>Move viewport to first step</button>
					<button onClick={appendStepClicked}>Append step</button>
				</div>

				<div>
					<textarea value={definitionJson} readOnly={true} cols={100} rows={4} />
				</div>
			</div>
		</>
	);
}
