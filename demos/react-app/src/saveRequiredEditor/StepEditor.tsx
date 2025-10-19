import { ChangeEvent, useState } from 'react';
import { Step } from 'sequential-workflow-designer';
import { useStepEditor } from 'sequential-workflow-designer-react';
import { ChangeController } from './ChangeController';

export function StepEditor(props: { changeController: ChangeController }) {
	const { name, setName } = useStepEditor<Step>();
	const [currentName, setCurrentName] = useState(() => name);
	const isDirty = name !== currentName;

	function onNameChanged(e: ChangeEvent) {
		const newName = (e.target as HTMLInputElement).value;
		setCurrentName(newName);
		props.changeController.set(name !== newName);
	}

	function onSave() {
		setName(currentName);
		// No need to reset the change controller here, it's already reset
		// in the parent component when the definition changes.
	}

	function onCancel() {
		setCurrentName(name);
		props.changeController.set(false);
	}

	return (
		<>
			<h2>Step Editor</h2>

			<h4>Name</h4>
			<input type="text" value={currentName} onChange={onNameChanged} />

			<p>
				<button onClick={onSave} disabled={!isDirty}>
					Save
				</button>{' '}
				<button onClick={onCancel} disabled={!isDirty}>
					Cancel
				</button>
			</p>
		</>
	);
}
