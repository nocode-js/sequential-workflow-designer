import { useState } from 'react';
import { Definition, Step, StepEditorContext } from 'sequential-workflow-designer';
import { SequentialWorkflowDesigner, wrapDefinition } from 'sequential-workflow-designer-react';

export const startDefinition: Definition = {
	sequence: [
		{
			id: '0x1',
			componentType: 'task',
			name: 'Foo',
			properties: {},
			type: 'test'
		}
	],
	properties: {}
};

function rootEditorProvider(): HTMLElement {
	const h2 = document.createElement('h2');
	h2.innerText = '🔌 Native Editors Demo';

	const p = document.createElement('p');
	p.innerHTML = 'This demo demonstrates how to use natively implemented editors inside React application.';

	const editor = document.createElement('div');
	editor.appendChild(h2);
	editor.appendChild(p);
	return editor;
}

function stepEditorProvider(step: Step, context: StepEditorContext): HTMLElement {
	const editor = document.createElement('div');
	const title = document.createElement('h2');
	title.innerText = `Edit ${step.type} step`;
	editor.appendChild(title);
	const nameInput = document.createElement('input');
	nameInput.value = step.name;
	nameInput.addEventListener('input', () => {
		step.name = nameInput.value;
		context.notifyNameChanged();
	});
	editor.appendChild(nameInput);
	return editor;
}

export function NativeEditors() {
	const [definition, setDefinition] = useState(() => wrapDefinition(startDefinition));

	return (
		<div className="designer">
			<SequentialWorkflowDesigner
				definition={definition}
				theme="soft"
				onDefinitionChange={setDefinition}
				toolboxConfiguration={false}
				stepsConfiguration={{}}
				controlBar={true}
				contextMenu={true}
				rootEditor={rootEditorProvider}
				stepEditor={stepEditorProvider}
			/>
		</div>
	);
}
