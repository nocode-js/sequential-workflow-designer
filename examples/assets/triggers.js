/* global document, sequentialWorkflowDesigner */

function createTriggerStep(id, name, properties) {
	return {
		id,
		componentType: 'task',
		type: 'trigger',
		name,
		properties: properties || {}
	};
}

function createTaskStep(id, type, name, properties) {
	return {
		id,
		componentType: 'task',
		type,
		name,
		properties: properties || {}
	};
}

function createLoopStep(id, steps) {
	return {
		id,
		componentType: 'container',
		type: 'loop',
		name: 'Loop',
		properties: {},
		sequence: steps
	};
}

const configuration = {
	theme: 'soft',
	undoStackSize: 20,

	toolbox: {
		groups: [
			{
				name: 'Triggers',
				steps: [
					createTriggerStep(null, 'On email received'),
					createTriggerStep(null, 'On file created'),
					createTriggerStep(null, 'On file modified')
				]
			},
			{
				name: 'Tasks',
				steps: [createTaskStep(null, 'save', 'Save file'), createTaskStep(null, 'text', 'Send email'), createLoopStep(null, [])]
			}
		]
	},

	controlBar: true,

	steps: {
		iconUrlProvider: (_, type) => {
			if (type === 'launchPad') {
				return './assets/icon-trigger.svg';
			}
			return `./assets/icon-${type}.svg`;
		},
		isDuplicable(step) {
			return step.componentType !== 'launchPad';
		},
		isDeletable(step) {
			return step.componentType !== 'launchPad';
		},
		isDraggable(step) {
			return step.componentType !== 'launchPad';
		},
		isSelectable(step) {
			return step.componentType !== 'launchPad';
		}
	},

	placeholder: {
		canCreate(sequence, index) {
			const definition = designer.getDefinition();
			const isRoot = sequence === definition.sequence;
			if (isRoot) {
				return index !== 0;
			}
			return true;
		},
		canShow(sequence, _0, _1, draggingStepType) {
			const definition = designer.getDefinition();
			const isTriggerStep = draggingStepType === 'trigger';
			const isLaunchPadSequence = sequence === definition.sequence[0].sequence;
			return (isLaunchPadSequence && isTriggerStep) || (!isLaunchPadSequence && !isTriggerStep);
		}
	},

	validator: {
		step: step => {
			return !step.properties['isInvalid'];
		}
	},

	editors: {
		rootEditorProvider: () => {
			const root = document.createElement('div');
			const h3 = document.createElement('h3');
			h3.innerText = 'Workflows Activated by Triggers';
			const p0 = document.createElement('p');
			p0.innerText =
				'This example demonstrates how to build a sequential workflow designer with support for triggers and tasks. A workflow can be initiated by any one of multiple triggers, after which a defined sequence of tasks is executed.';
			const p1 = document.createElement('p');
			p1.innerText =
				'Please note that only trigger steps can be added in the launch section, while any task steps can be added in the section below.';

			root.appendChild(h3);
			root.appendChild(p0);
			root.appendChild(p1);
			return root;
		},
		stepEditorProvider: step => {
			const root = document.createElement('div');
			root.innerText = `Selected step type: ${step.type}`;
			return root;
		}
	},

	extensions: [
		sequentialWorkflowDesigner.StartStopRootComponentDesignerExtension.create({
			view: {
				start: null
			}
		})
	]
};

const definition = {
	properties: {},
	sequence: [
		{
			id: 'launchPad',
			name: 'Launch Pad',
			componentType: 'launchPad',
			type: 'launchPad',
			properties: {},
			sequence: [createTriggerStep('0x1', 'On email received'), createTriggerStep('0x2', 'On file created')]
		},
		createTaskStep('0x3', 'save', 'Save file'),
		createLoopStep('0x4', [createTaskStep('0x6', 'text', 'Send SMS')])
	]
};

const placeholder = document.getElementById('designer');
const designer = sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
