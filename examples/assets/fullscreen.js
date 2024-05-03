/* global document, sequentialWorkflowDesigner, console, localStorage */

function createTaskStep(id, type, name, properties) {
	return {
		id,
		componentType: 'task',
		type,
		name,
		properties: properties || {}
	};
}

function createIfStep(id, _true, _false) {
	return {
		id,
		componentType: 'switch',
		type: 'if',
		name: 'If',
		branches: {
			true: _true,
			false: _false
		},
		properties: {}
	};
}

function createContainerStep(id, steps) {
	return {
		id,
		componentType: 'container',
		type: 'loop',
		name: 'Loop',
		properties: {},
		sequence: steps
	};
}

function toolboxGroup(name) {
	return {
		name,
		steps: [
			createTaskStep(null, 'save', 'Save file'),
			createTaskStep(null, 'text', 'Send email'),
			createTaskStep(null, 'task', 'Create task'),
			createIfStep(null, [], []),
			createContainerStep(null, [])
		]
	};
}

function reloadChangeReadonlyButtonText() {
	changeReadonlyButton.innerText = 'Readonly: ' + (designer.isReadonly() ? 'ON' : 'OFF');
}

function appendCheckbox(root, label, isReadonly, isChecked, onClick) {
	const item = document.createElement('div');
	item.innerHTML = '<div><h3></h3> <input type="checkbox" /></div>';
	const h3 = item.getElementsByTagName('h3')[0];
	h3.innerText = label;
	const input = item.getElementsByTagName('input')[0];
	input.checked = isChecked;
	if (isReadonly) {
		input.setAttribute('disabled', 'disabled');
	}
	input.addEventListener('click', () => {
		onClick(input.checked);
	});
	root.appendChild(item);
}

function appendPath(root, step) {
	const parents = designer.getStepParents(step);
	const path = document.createElement('div');
	path.className = 'step-path';
	path.innerText =
		'Step path: ' +
		parents
			.map(parent => {
				return typeof parent === 'string' ? parent : parent.name;
			})
			.join('/');
	root.appendChild(path);
}

let designer;
let changeReadonlyButton;
let validationStatusText;
const localStorageKey = 'sqdFullscreen';

function refreshValidationStatus() {
	validationStatusText.innerText = designer.isValid() ? 'Definition is valid' : 'Definition is invalid';
}

function loadState() {
	const state = localStorage[localStorageKey];
	if (state) {
		return JSON.parse(state);
	}
	return {
		definition: getStartDefinition()
	};
}

function saveState() {
	localStorage[localStorageKey] = JSON.stringify({
		definition: designer.getDefinition(),
		undoStack: designer.dumpUndoStack()
	});
}

const initialState = loadState();

const configuration = {
	undoStackSize: 20,
	undoStack: initialState.undoStack,

	toolbox: {
		groups: [toolboxGroup('Main'), toolboxGroup('File system'), toolboxGroup('E-mail')]
	},

	controlBar: true,

	steps: {
		isDuplicable: () => true,
		iconUrlProvider: (_, type) => {
			return `./assets/icon-${type}.svg`;
		}
	},

	validator: {
		step: step => {
			return !step.properties['isInvalid'];
		}
	},

	editors: {
		rootEditorProvider: (definition, _context, isReadonly) => {
			const root = document.createElement('div');
			root.className = 'definition-json';
			root.innerHTML = '<textarea style="width: 100%; border: 0;" rows="50"></textarea>';
			const textarea = root.getElementsByTagName('textarea')[0];
			if (isReadonly) {
				textarea.setAttribute('readonly', 'readonly');
			}
			textarea.value = JSON.stringify(definition, null, 2);
			return root;
		},

		stepEditorProvider: (step, editorContext, _definition, isReadonly) => {
			const root = document.createElement('div');

			appendCheckbox(root, 'Is invalid', isReadonly, !!step.properties['isInvalid'], checked => {
				step.properties['isInvalid'] = checked;
				editorContext.notifyPropertiesChanged();
			});

			if (step.type === 'if') {
				appendCheckbox(root, 'Catch branch', isReadonly, !!step.branches['catch'], checked => {
					if (checked) {
						step.branches['catch'] = [];
					} else {
						delete step.branches['catch'];
					}
					editorContext.notifyChildrenChanged();
				});
			}

			appendPath(root, step);
			return root;
		}
	}
};

function getStartDefinition() {
	return {
		properties: {},
		sequence: [
			createIfStep(
				'00000000000000000000000000000001',
				[createTaskStep('00000000000000000000000000000002', 'save', 'Save file', { isInvalid: true })],
				[createTaskStep('00000000000000000000000000000003', 'text', 'Send email')]
			),
			createContainerStep('00000000000000000000000000000004', [
				createTaskStep('00000000000000000000000000000005', 'task', 'Create task')
			])
		]
	};
}

const placeholder = document.getElementById('designer');
designer = sequentialWorkflowDesigner.Designer.create(placeholder, initialState.definition, configuration);
designer.onDefinitionChanged.subscribe(newDefinition => {
	refreshValidationStatus();
	saveState();
	console.log('the definition has changed', newDefinition);
});

changeReadonlyButton = document.getElementById('changeReadonlyButton');
changeReadonlyButton.addEventListener('click', () => {
	designer.setIsReadonly(!designer.isReadonly());
	reloadChangeReadonlyButtonText();
});
reloadChangeReadonlyButtonText();

validationStatusText = document.getElementById('validationStatus');
refreshValidationStatus();
