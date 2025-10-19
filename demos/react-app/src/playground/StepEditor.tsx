import { ChangeEvent } from 'react';
import { useStepEditor } from 'sequential-workflow-designer-react';
import { SwitchStep, TaskStep } from './model';

export function StepEditor() {
	const { type, name, step, properties, isReadonly, setName, setProperty, notifyPropertiesChanged, notifyChildrenChanged } =
		useStepEditor<TaskStep | SwitchStep>();

	function onNameChanged(e: ChangeEvent) {
		setName((e.target as HTMLInputElement).value);
	}

	function onXChanged(e: ChangeEvent) {
		setProperty('x', (e.target as HTMLInputElement).value);
	}

	function onYChanged(e: ChangeEvent) {
		properties['y'] = (e.target as HTMLInputElement).value;
		notifyPropertiesChanged();
	}

	function toggleExtraBranch() {
		const switchStep = step as SwitchStep;
		if (switchStep.branches['extra']) {
			delete switchStep.branches['extra'];
		} else {
			switchStep.branches['extra'] = [];
		}
		notifyChildrenChanged();
	}

	return (
		<>
			<h2>Step Editor - {type}</h2>

			<h4>Name</h4>
			<input type="text" value={name} readOnly={isReadonly} onChange={onNameChanged} />

			<h4>X Variable</h4>
			<input type="text" value={properties.x || ''} readOnly={isReadonly} onChange={onXChanged} />

			<h4>Y Variable</h4>
			<input type="text" value={properties.y || ''} readOnly={isReadonly} onChange={onYChanged} />

			{type === 'switch' && (
				<>
					<h4>Extra branch</h4>
					<button onClick={toggleExtraBranch} disabled={isReadonly}>
						Toggle branch
					</button>
				</>
			)}
		</>
	);
}
