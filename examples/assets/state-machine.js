/* global document, window, setTimeout, sequentialWorkflowDesigner */

function uid() {
	return Math.ceil(Math.random() * 10**16).toString(16);
}

class StateMachine {

	constructor(designer) {
		this.designer = designer;
		this.definition = designer.getDefinition();
		this.speed = this.definition.properties['speed'];
		this.state = {
			callstack: [
				{
					sequence: this.definition.sequence,
					index: 0,
					unwind: null
				}
			],
			vars: {}
		};
	}

	clearConsole() {
		document.getElementById('console').innerText = '';
	}

	printText(message) {
		const time = (new Date()).toLocaleTimeString();
		document.getElementById('console').innerText += `<${time}> ${message}\r\n`;
	}

	printState() {
		document.getElementById('state').innerText = JSON.stringify({
			stepIndex: this.state.stepIndex,
			vars: this.state.vars
		}, null, 2);
	}

	createVariableIfNeeded(varName) {
		if (!this.state.vars[varName]) {
			this.state.vars[varName] = 0;
		}
	}

	executeMathStep(step) {
		const varName = step.properties['var'];
		const value = step.properties['val'];
		this.createVariableIfNeeded(varName);
		switch (step.type) {
			case 'add':
				this.state.vars[varName] += value;
				break;
			case 'sub':
				this.state.vars[varName] -= value;
				break;
			case 'mul':
				this.state.vars[varName] *= value;
				break;
			case 'div':
				this.state.vars[varName] /= value;
				break;
		}
	}

	unwindStack() {
		this.state.callstack.pop();
	}

	executeIfStep(step) {
		var varName = step.properties['var'];
		this.createVariableIfNeeded(varName, this.state);
		const branchName = (this.state.vars[varName] > step.properties['val'])
			? 'true'
			: 'false';

		this.state.callstack.push({
			sequence: step.branches[branchName],
			index: 0,
			unwind: this.unwindStack.bind(this)
		});
	}

	executeLoopStep(step) {
		const varName = step.properties['var'];
		this.state.vars[varName] = step.properties['val'];

		const program = {
			sequence: step.sequence,
			index: 0,
			unwind: () => {
				if (this.state.vars[varName] > 0) {
					program.index = 0;
					this.state.vars[varName]--;
				} else {
					this.unwindStack(this.state);
				}
			}
		};
		this.state.callstack.push(program);
	}

	execute() {
		const depth = this.state.callstack.length - 1;
		const program = this.state.callstack[depth];

		if (program.sequence.length === program.index) {
			if (depth > 0) {
				program.unwind();
				this.execute();
			} else {
				this.designer.setIsReadonly(false);
				this.designer.clearSelectedStep();
			}
			return;
		}

		const step = program.sequence[program.index];
		program.index++;

		switch (step.type) {
			case 'add':
			case 'sub':
			case 'div':
			case 'mul':
				this.executeMathStep(step);
				break;
			case 'text':
				this.printText(step.properties['text']);
				break;
			case 'if':
				this.executeIfStep(step);
				break;
			case 'loop':
				this.executeLoopStep(step);
				break;
		}

		this.designer.selectStepById(step.id);
		this.designer.moveViewPortToStep(step.id);
		this.printState();
		setTimeout(this.execute.bind(this), this.speed);
	}

	start() {
		this.designer.setIsReadonly(true);
		this.clearConsole();
		this.execute();
	}
}

class StepCreator {

	static createMathStep(type, name, varName, val) {
		return {
			id: uid(),
			componentType: 'task',
			type,
			name,
			properties: {
				var: varName,
				val
			}
		};
	}

	static createTextStep(message) {
		return {
			id: uid(),
			componentType: 'task',
			type: 'text',
			name: message,
			properties: {
				text: message
			}
		};
	}

	static createIfStep(varName, val, name, trueSteps, falseSteps) {
		return {
			id: uid(),
			componentType: 'switch',
			type: 'if',
			name,
			branches: {
				'true': trueSteps || [],
				'false': falseSteps || []
			},
			properties: {
				var: varName,
				val
			}
		};
	}

	static createLoopStep(varName, val, name, steps) {
		return {
			id: uid(),
			componentType: 'container',
			type: 'loop',
			name,
			sequence: steps || [],
			properties: {
				var: varName,
				val
			}
		};
	}
}

let designer;

function onRunClicked() {
	if (!designer.isReadonly()) {
		const stateMachine = new StateMachine(designer);
		stateMachine.start();
	}
}

function appendTitle(parent, text) {
	const title = document.createElement('h4');
	title.innerText = text;
	parent.appendChild(title);
}

function appendTextField(parent, label, startValue, set) {
	const field = document.createElement('p');
	parent.appendChild(field);
	field.innerHTML = `<label></label> <input type="text">`;
	field.querySelector('label').innerText = label;
	const input = field.querySelector('input');
	input.value = startValue;
	field.addEventListener('input', () => set(input.value));
}

function globalEditorProvider(definition) {
	const container = document.createElement('span');
	appendTitle(container, 'State machine config');
	appendTextField(container, 'Speed (ms)', definition.properties['speed'],
		v => definition.properties['speed'] = parseInt(v, 10));
	return container;
}

function stepEditorProvider(step) {
	const container = document.createElement('div');
	appendTitle(container, 'Step ' + step.type);

	appendTextField(container, 'Name', step.name,
		v => {
			step.name = v;
			designer.notifiyDefinitionChanged();
		});
	if (step.properties['var'] !== undefined) {
		appendTextField(container, 'Variable', step.properties['var'],
			v => {
				step.properties['var'] = v;
				designer.revalidate();
			});
	}
	if (step.properties['val']) {
		appendTextField(container, 'Value', step.properties['val'],
			v => {
				step.properties['val'] = parseInt(v, 10);
				designer.revalidate();
			});
	}
	if (step.properties['text']) {
		appendTextField(container, 'Text', step.properties['text'],
			v => {
				step.properties['text'] = v;
				designer.revalidate();
			});
	}
	return container;
}

const configuration = {
	toolbox: {
		isHidden: false,
		groups: [
			{
				name: 'Tasks',
				steps: [
					StepCreator.createMathStep('add', 'Add', 'x', 10),
					StepCreator.createMathStep('sub', 'Subtract', 'x', 10),
					StepCreator.createMathStep('mul', 'Multiply', 'x', 10),
					StepCreator.createMathStep('div', 'Divide', 'x', 10),
					StepCreator.createTextStep('Message!')
				]
			},
			{
				name: 'Logic',
				steps: [
					StepCreator.createIfStep('x', 10, 'If'),
					StepCreator.createLoopStep('index', 3, 'Loop')
				]
			}
		]
	},

	steps: {
		iconUrlProvider: (componentType, type) => {
			const supportedIcons = ['if', 'loop', 'text'];
			const fileName = supportedIcons.includes(type) ? type : 'task';
			return `./assets/icon-${fileName}.svg`;
		},
		validator: (step) => {
			return Object.keys(step.properties).every(n => !!step.properties[n]);
		}
	},

	editors: {
		globalEditorProvider,
		stepEditorProvider
	}
};

const startDefinition = {
	properties: {
		speed: 300
	},
	sequence: [
		StepCreator.createTextStep('start!'),
		StepCreator.createLoopStep('index', 4, 'Loop', [
			StepCreator.createMathStep('add', 'x += 3', 'x', 3),
			StepCreator.createMathStep('mul', 'x *= 2', 'x', 2),
			StepCreator.createIfStep('x', 50, 'If x > 50',
				[ StepCreator.createTextStep('yes!') ],
				[ StepCreator.createTextStep('no...')]),
		]),
		StepCreator.createTextStep('the end')
	]
};

window.addEventListener('load', () => {
	const placeholder = document.getElementById('designer');
	designer = sequentialWorkflowDesigner.create(placeholder, startDefinition, configuration);
	document.getElementById('run').addEventListener('click', onRunClicked);
});
