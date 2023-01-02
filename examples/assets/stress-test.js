/* global document, sequentialWorkflowDesigner, prompt, alert */

const uid = sequentialWorkflowDesigner.Uid.next;

class Steps {
	static createTask() {
		return {
			id: uid(),
			componentType: 'task',
			type: 'task',
			name: 'Stress test',
			properties: {}
		};
	}

	static createSwitch(trueSteps, falseSteps) {
		return {
			id: uid(),
			componentType: 'switch',
			type: 'if',
			name: 'Switch',
			branches: {
				'true': trueSteps,
				'false': falseSteps
			},
			properties: {}
		};
	}
}

const configuration = {
	toolbox: {
		isHidden: true,
		groups: []
	},

	steps: {
		iconUrlProvider: (_, type) => {
			return `./assets/icon-${type}.svg`;
		},

		validator: () => true
	},

	editors: {
		isHidden: true,
		globalEditorProvider: () => {
			throw new Error('Not implemented');
		},
		stepEditorProvider: (step) => {
			throw new Error('Not implemented');
		}
	}
};

const LIMIT = 256;
const MAX_TASKS_PER_STEP = 22;

let limit = LIMIT;
const rootSequence = [];

function rand() {
	return Math.random() > 0.5;
}

function append(sequence) {
	if (limit <= 0) {
		return;
	}

	const trueSequence = [];
	const falseSequence = [];

	sequence.push(Steps.createTask());
	limit--;
	for (let i = 0; i < MAX_TASKS_PER_STEP && limit > 0; i++) {
		if (rand()) {
			sequence.push(Steps.createTask());
			limit--;
		}
	}

	if (limit > 0) {
		sequence.push(Steps.createSwitch(trueSequence, falseSequence));
		limit--;
	}

	if (limit % 2 === 0) {
		append(trueSequence);
	} else {
		append(falseSequence);
	}
}

append(rootSequence);

const startDefinition = {
	properties: {},
	sequence: rootSequence
};

const placeholder = document.getElementById('designer');
const designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
