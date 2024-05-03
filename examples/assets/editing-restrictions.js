/* global window, document, sequentialWorkflowDesigner, console */

function createStep(name, properties) {
	return {
		id: sequentialWorkflowDesigner.Uid.next(),
		componentType: 'task',
		type: 'task',
		name,
		properties: Object.assign(
			{
				selectable: true,
				draggable: true,
				deletable: true
			},
			properties
		)
	};
}

function createLoopStep() {
	return {
		id: sequentialWorkflowDesigner.Uid.next(),
		componentType: 'container',
		type: 'loop',
		name: 'Loop',
		properties: {
			selectable: true,
			draggable: true,
			deletable: true
		},
		sequence: []
	};
}

function createEditor(text) {
	const editor = document.createElement('div');
	editor.innerText = text;
	return editor;
}

function serializeStepParents(parents) {
	return '/' + parents.map(s => (Array.isArray(s) ? 'sequence' : s.name)).join('/');
}

function load() {
	const placeholder = document.getElementById('designer');
	const definition = {
		sequence: [
			createStep('isSelectable=true', { selectable: true }),
			createStep('isSelectable=false', { selectable: false }),
			createStep('isDraggable=true', { draggable: true }),
			createStep('isDraggable=false', { draggable: false }),
			createStep('isDeletable=true', { deletable: true }),
			createStep('isDeletable=false', { deletable: false })
		],
		properties: {}
	};
	let designer;
	const configuration = {
		toolbox: {
			isCollapsed: true,
			labelProvider: step => `** ${step.name} **`,
			descriptionProvider: step => `This is a description for ${step.name}`,
			groups: [
				{
					name: 'Steps',
					steps: [createLoopStep()]
				}
			]
		},

		steps: {
			isSelectable: step => {
				return step.properties.selectable;
			},
			canInsertStep: (step, _, targetIndex) => {
				return window.confirm(`Can insert "${step.name}" (${targetIndex})?`);
			},
			isDraggable: step => {
				return step.properties.draggable;
			},
			canMoveStep: (sourceSequence, step, targetSequence, index) => {
				const sourcePath = designer.getStepParents(sourceSequence);
				const sourceIndex = sourceSequence.indexOf(step);
				const targetPath = designer.getStepParents(targetSequence);
				const message = [
					`Can move "${step.name}"?`,
					`Source: ${serializeStepParents(sourcePath)} (${sourceIndex})`,
					`Target: ${serializeStepParents(targetPath)} (${index})`
				];
				return window.confirm(message.join('\n'));
			},
			isDeletable: step => {
				return step.properties.deletable;
			},
			isDuplicable: step => {
				return step.properties.deletable;
			},
			canDeleteStep: step => {
				return window.confirm(`Can delete "${step.name}"?`);
			},
			iconUrlProvider: () => {
				return './assets/icon-task.svg';
			}
		},

		editors: {
			isCollapsed: true,
			rootEditorProvider: () => {
				return createEditor('Please select any step.');
			},
			stepEditorProvider: step => {
				return createEditor(`Selected step: ${step.type}`);
			}
		},
		controlBar: true
	};
	designer = sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
	designer.onIsToolboxCollapsedChanged.subscribe(is => console.log(`isToolboxCollapsed = ${is}`));
	designer.onIsEditorCollapsedChanged.subscribe(is => console.log(`isEditorCollapsed = ${is}`));
}

window.addEventListener('load', load);
