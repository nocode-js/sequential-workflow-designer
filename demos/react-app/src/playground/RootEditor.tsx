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
			<h2>🍭 Playground Demo</h2>

			<p>This demo showcases how several features of the Sequential Workflow Designer can be used within a React application.</p>

			<h4>Alfa</h4>

			<input type="text" value={properties.alfa || ''} readOnly={isReadonly} onChange={onAlfaChanged} />
		</>
	);
}
