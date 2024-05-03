/* global document, sequentialWorkflowDesigner, localStorage */

function uid() {
	return sequentialWorkflowDesigner.Uid.next();
}

function createTaskStep(name) {
	return {
		id: uid(),
		componentType: 'task',
		type: 'task',
		name,
		properties: {}
	};
}

function createSwitchStep(name, branches) {
	return {
		id: uid(),
		componentType: 'switch',
		type: 'switch',
		name,
		properties: {},
		branches
	};
}

function createContainerStep(name, sequence) {
	return {
		id: uid(),
		componentType: 'container',
		type: 'container',
		name,
		sequence,
		properties: {}
	};
}

const switchLabelsDefinition = {
	properties: {},
	sequence: [
		createSwitchStep('short', {
			$: [],
			'!': []
		}),
		createSwitchStep('short', {
			$: [],
			'quite long branch name for switch step': [createTaskStep('@')]
		}),
		createSwitchStep('super long description for switch step super long description', {
			$: [],
			'#': []
		}),
		createSwitchStep('super long description for switch step super long description', {
			$: [],
			'quite long branch name for switch step quite long branch name for switch step': []
		}),
		createSwitchStep('@', {
			$: [],
			'#': [createTaskStep('super long description super long description')]
		}),
		createSwitchStep('@', {
			1: [],
			2: [],
			3: []
		}),
		createSwitchStep('@', {
			'#': [
				createSwitchStep('@', {
					'some long branch name': [],
					'@': []
				})
			],
			'@': []
		})
	]
};

const containerLabelsDefinition = {
	properties: {},
	sequence: [
		createContainerStep('$', []),
		createContainerStep('$', [createTaskStep('super long description of a task')]),
		createContainerStep('super long description super long description', [createTaskStep('@')]),
		createContainerStep('super long description super long description super long description super', [
			createSwitchStep('@', {
				'!': [],
				'some super long branch name': []
			})
		]),
		createContainerStep('$', [
			createSwitchStep('@', {
				'!': [],
				'some super long branch name': []
			})
		]),
		createContainerStep('$', [
			createSwitchStep('@', {
				'some super long branch name': [],
				'!': []
			})
		])
	]
};

const sequenceSizeDefinition = {
	properties: {},
	sequence: [
		createSwitchStep('$', {
			true: [
				createTaskStep('Lorem Ipsum is simply dummy text of the printing and typesetting industry'),
				createSwitchStep('$', {
					true: [createTaskStep('Lorem Ipsum is simply dummy text of the printing and typesetting industry')],
					false: []
				})
			],
			false: [createTaskStep('@')]
		})
	]
};

const testCases = {
	'Switch labels': switchLabelsDefinition,
	'Container labels': containerLabelsDefinition,
	'Sequence size': sequenceSizeDefinition
};
let designer;

function initDesigner(testCaseName) {
	if (designer) {
		designer.destroy();
	}

	const definition = testCases[testCaseName];
	const configuration = {
		toolbox: false,

		steps: {
			iconUrlProvider: () => './assets/icon-task.svg'
		},

		editors: {
			rootEditorProvider: () => {
				const editor = document.createElement('div');
				editor.innerText = 'Please select any step.';
				return editor;
			},
			stepEditorProvider: step => {
				const editor = document.createElement('div');
				editor.innerText = `Component type: ${step.componentType}`;
				return editor;
			}
		},

		controlBar: true
	};

	const placeholder = document.getElementById('designer');
	designer = sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
}

const localStorageKey = 'sqdRenderingTest';

document.addEventListener('DOMContentLoaded', () => {
	const testCaseNames = Object.keys(testCases);
	const startTestCaseName = localStorage[localStorageKey] || testCaseNames[0];

	const testCasesSelect = document.getElementById('testCases');
	testCaseNames.forEach(name => {
		const option = document.createElement('option');
		option.innerText = name;
		testCasesSelect.appendChild(option);
	});
	testCasesSelect.value = startTestCaseName;
	testCasesSelect.addEventListener('change', () => {
		const name = testCasesSelect.value;
		localStorage[localStorageKey] = name;
		initDesigner(name);
	});

	initDesigner(startTestCaseName);
});
