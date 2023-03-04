import { ChangeEvent } from 'react';
import { useGlobalEditor } from 'sequential-workflow-designer-react';
import { WorkflowDefinition } from './model';

export function GlobalEditor() {
	const { properties, setProperty } = useGlobalEditor<WorkflowDefinition>();

	function onAlfaChanged(e: ChangeEvent) {
		setProperty('alfa', (e.target as HTMLInputElement).value);
	}

	return (
		<>
			<h2>Global editor</h2>

			<h4>Alfa</h4>

			<input type="text" value={properties.alfa || ''} onChange={onAlfaChanged} />
		</>
	);
}
