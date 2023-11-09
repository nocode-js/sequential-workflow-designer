import { ChangeEvent } from 'react';
import { useRootEditor } from 'sequential-workflow-designer-react';
import { WorkflowDefinition } from './model';

export function RootEditor() {
	const { properties, setProperty, isReadonly } = useRootEditor<WorkflowDefinition>();

	function onAlfaChanged(e: ChangeEvent) {
		setProperty('alfa', (e.target as HTMLInputElement).value);
	}

	return (
		<>
			<h2>Root editor</h2>

			<h4>Alfa</h4>

			<input type="text" value={properties.alfa || ''} readOnly={isReadonly} onChange={onAlfaChanged} />
		</>
	);
}
