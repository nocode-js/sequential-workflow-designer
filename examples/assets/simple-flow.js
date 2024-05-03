/* global document, sequentialWorkflowDesigner, prompt, alert */

const configuration = {
	toolbox: {
		groups: [
			{
				name: 'Steps',
				steps: [
					{
						componentType: 'task',
						type: 'readUserInput',
						name: 'Read User Input',
						properties: {
							question: 'Ask me'
						}
					},
					{
						componentType: 'task',
						type: 'sendEmail',
						name: 'Send E-mail',
						properties: {
							ifReqisterEquals: '1',
							email: 'x@example.com'
						}
					}
				]
			}
		]
	},

	steps: {
		iconUrlProvider: () => {
			return `./assets/icon-task.svg`;
		}
	},

	editors: {
		rootEditorProvider: () => {
			const editor = document.createElement('div');
			editor.innerText = 'Please select any step.';
			return editor;
		},
		stepEditorProvider: step => {
			const editor = document.createElement('div');

			if (step.type === 'readUserInput') {
				const label = document.createElement('label');
				label.innerText = 'Question';
				const input = document.createElement('input');
				input.setAttribute('type', 'text');
				input.value = step.properties['question'];
				input.addEventListener('input', () => {
					step.properties['question'] = input.value;
				});

				editor.appendChild(label);
				editor.appendChild(input);
			} else if (step.type === 'sendEmail') {
				const propNames = ['ifReqisterEquals', 'email'];
				for (let propName of propNames) {
					const label = document.createElement('label');
					label.innerText = propName;
					const input = document.createElement('input');
					input.setAttribute('type', 'text');
					input.value = step.properties[propName];
					input.addEventListener('input', () => {
						step.properties[propName] = input.value;
					});

					editor.appendChild(label);
					editor.appendChild(input);
				}
			}

			return editor;
		}
	},

	controlBar: true
};

const startDefinition = {
	properties: {},
	sequence: []
};

const placeholder = document.getElementById('designer');
const designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);

function runWorkflow() {
	const definition = designer.getDefinition();

	let register = null;

	if (definition.sequence.length < 1) {
		alert('Please add any step...');
		return;
	}

	for (let step of definition.sequence) {
		if (step.type === 'readUserInput') {
			register = prompt(step.properties['question']);
		} else if (step.type === 'sendEmail') {
			if (step.properties['ifReqisterEquals'] === register) {
				alert(`E-mail sent to ${step.properties['email']}`);
			}
		}
	}
}

document.getElementById('run').addEventListener('click', runWorkflow);
