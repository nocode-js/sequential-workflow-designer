/* global document, sequentialWorkflowDesigner */

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
				true: trueSteps,
				false: falseSteps
			},
			properties: {}
		};
	}
}

const configuration = {
	steps: {
		iconUrlProvider: (_, type) => {
			return `./assets/icon-${type}.svg`;
		}
	},
	toolbox: false,
	editors: false,
	controlBar: true
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
sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
