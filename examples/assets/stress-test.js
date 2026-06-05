/* global document, sequentialWorkflowDesigner */

const uid = sequentialWorkflowDesigner.Uid.next;

// In this example, we are using a custom text width measurer that uses canvas to measure the width of the text.
// This approach is much faster than the default one, which uses `getBBox`, but the downside is that
// we need to set the same font that is used in the designer.
class TextWidthMeasurer {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.context.font = '14px "Open Sans", Arial, Verdana, Serif';
	}

	measure = text => {
		return this.context.measureText(text.textContent).width;
	};
}

class Steps {
	static createTask() {
		const n = Math.floor(Math.random() * 10) + 1;
		return {
			id: uid(),
			componentType: 'task',
			type: 'task',
			name: 'Str' + 'e'.repeat(n) + 'ss test',
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
	theme: 'soft',
	steps: {
		iconUrlProvider: (_, type) => {
			return `./assets/icon-${type}.svg`;
		}
	},
	toolbox: false,
	editors: false,
	controlBar: true,
	textWidthMeasurer: new TextWidthMeasurer().measure
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
let startTime = Date.now();
const designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
designer.onRootComponentUpdated.subscribe(() => {
	if (startTime === null) {
		return;
	}
	const endTime = Date.now();
	console.log(`First render time: ${endTime - startTime}ms`);
	startTime = null;
});
