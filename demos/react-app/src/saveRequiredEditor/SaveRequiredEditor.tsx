import { useEffect, useMemo, useState } from 'react';
import { Definition, Step, StepsConfiguration, Uid } from 'sequential-workflow-designer';
import { SequentialWorkflowDesigner, wrapDefinition, WrappedDefinition } from 'sequential-workflow-designer-react';
import { StepEditor } from './StepEditor';
import { RootEditor } from './RootEditor';
import { ChangeController, useChangeControllerWrapper } from './ChangeController';

import './style.css';

function createStep(name: string): Step {
	return {
		id: Uid.next(),
		name,
		componentType: 'task',
		type: 'task',
		properties: {}
	};
}

function createDefinition(): Definition {
	return {
		sequence: [createStep('Alfa'), createStep('Beta'), createStep('Gamma')],
		properties: {}
	};
}

export function SaveRequiredEditor() {
	const changeController = useMemo(() => new ChangeController(), []);
	const changeControllerWrapper = useChangeControllerWrapper(changeController);

	const [definition, setDefinition] = useState(() => wrapDefinition(createDefinition()));
	const [isUnselectionBlocked, setIsUnselectionBlocked] = useState(false);

	const stepsConfiguration: StepsConfiguration = useMemo(
		() => ({
			canUnselectStep: () => !changeController.isChanged
		}),
		[changeController]
	);

	useEffect(() => {
		if (isUnselectionBlocked) {
			let to: ReturnType<typeof setTimeout> | null = setTimeout(() => {
				setIsUnselectionBlocked(false);
				to = null;
			}, 2000);
			return () => {
				if (to) {
					clearTimeout(to);
				}
			};
		}
	}, [isUnselectionBlocked]);

	function onDefinitionChange(definition: WrappedDefinition) {
		setDefinition(definition);
		if (changeController.isChanged) {
			changeController.set(false);
		}
	}

	function onStepUnselectionBlocked() {
		if (!isUnselectionBlocked) {
			setIsUnselectionBlocked(true);
		}
	}

	function onSelectedStepIdChanged() {
		if (changeController.isChanged) {
			// We need to reset the change controller when the selected step id is changed,
			// for example this happens when a step is deleted.
			changeController.set(false);
		}
	}

	return (
		<>
			{isUnselectionBlocked && <div className="unselectionBlocked">Please save or cancel changes before unselecting the step.</div>}

			<div className="designer">
				<SequentialWorkflowDesigner
					definition={definition}
					undoStackSize={10}
					theme="soft"
					onDefinitionChange={onDefinitionChange}
					toolboxConfiguration={false}
					stepsConfiguration={stepsConfiguration}
					onSelectedStepIdChanged={onSelectedStepIdChanged}
					onStepUnselectionBlocked={onStepUnselectionBlocked}
					controlBar={true}
					contextMenu={true}
					rootEditor={<RootEditor />}
					stepEditor={<StepEditor changeController={changeControllerWrapper.controller} />}
				/>
			</div>

			<div className="sidebar">
				<ul>
					<li>Unsaved changes: {changeControllerWrapper.isChanged ? '✅ Yes' : '⛔ No'}</li>
				</ul>
			</div>
		</>
	);
}
