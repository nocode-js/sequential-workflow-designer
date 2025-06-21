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
				name: 'Signals',
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
			return root;
		},
		stepEditorProvider: step => {
			const root = document.createElement('div');
			root.innerText = step.type;
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
		createTaskStep('0x3', 'save', 'Save file')
	]
};

const placeholder = document.getElementById('designer');
const designer = sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
