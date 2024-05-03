/* global window, document, StateMachine, StateMachineSteps, sequentialWorkflowDesigner */

let designer;

class Steps {
	static createMathStep(type, name, varName, val) {
		return StateMachineSteps.createTaskStep(name, type, {
			var: varName,
			val
		});
	}

	static createTextStep(message) {
		return StateMachineSteps.createTaskStep(message, 'text', {
			text: message
		});
	}

	static createIfStep(varName, val, name, trueSteps, falseSteps) {
		return StateMachineSteps.createIfStep(
			name,
			{
				var: varName,
				val
			},
			trueSteps,
			falseSteps
		);
	}

	static createLoopStep(varName, val, name, steps) {
		return StateMachineSteps.createLoopStep(
			name,
			{
				var: varName,
				val
			},
			steps
		);
	}
}

function createVariableIfNeeded(varName, data) {
	if (typeof data[varName] === 'undefined') {
		data[varName] = 0;
	}
}

function onRunClicked() {
	if (designer.isReadonly()) {
		return;
	}
	if (!designer.isValid()) {
		window.alert('The definition is invalid');
		return;
	}

	designer.setIsReadonly(true);

	const definition = designer.getDefinition();
	const sm = new StateMachine(definition, definition.properties['speed'], {
		executeStep: (step, data) => {
			if (step.type === 'text') {
				document.getElementById('console').innerText += step.properties['text'] + '\r\n';
				return;
			}

			const varName = step.properties['var'];
			const value = step.properties['val'];
			createVariableIfNeeded(varName, data);
			switch (step.type) {
				case 'add':
					data[varName] += value;
					break;
				case 'sub':
					data[varName] -= value;
					break;
				case 'mul':
					data[varName] *= value;
					break;
				case 'div':
					data[varName] /= value;
					break;
			}
		},

		executeIf: (step, data) => {
			var varName = step.properties['var'];
			createVariableIfNeeded(varName, data);
			return data[varName] > step.properties['val'];
		},

		initLoopStep: (step, data) => {
			const varName = step.properties['var'];
			createVariableIfNeeded(varName, data);
			data[varName] = step.properties['val'];
		},

		canReplyLoopStep: (step, data) => {
			const varName = step.properties['var'];
			return --data[varName] >= 0;
		},

		onStepExecuted: (step, data) => {
			document.getElementById('variables').innerText = JSON.stringify(data, null, 2) + '\r\n';
			designer.selectStepById(step.id);
			designer.moveViewportToStep(step.id);
		},

		onFinished: () => {
			designer.setIsReadonly(false);
		}
	});
	sm.start();
}

function appendTitle(parent, text) {
	const title = document.createElement('h4');
	title.innerText = text;
	parent.appendChild(title);
}

function appendTextField(parent, label, isReadonly, startValue, set) {
	const field = document.createElement('p');
	parent.appendChild(field);
	field.innerHTML = `<label></label> <input type="text">`;
	field.querySelector('label').innerText = label;
	const input = field.querySelector('input');
	input.value = startValue;
	if (isReadonly) {
		input.setAttribute('readonly', 'readonly');
	}
	field.addEventListener('input', () => set(input.value));
}

function rootEditorProvider(definition, editorContext, isReadonly) {
	const container = document.createElement('span');
	appendTitle(container, 'State machine config');
	appendTextField(container, 'Speed (ms)', isReadonly, definition.properties['speed'], v => {
		definition.properties['speed'] = parseInt(v, 10);
		editorContext.notifyPropertiesChanged();
	});
	return container;
}

function stepEditorProvider(step, editorContext, _definition, isReadonly) {
	const container = document.createElement('div');
	appendTitle(container, 'Step ' + step.type);

	appendTextField(container, 'Name', isReadonly, step.name, v => {
		step.name = v;
		editorContext.notifyNameChanged();
	});
	if (step.properties['var'] !== undefined) {
		appendTextField(container, 'Variable', isReadonly, step.properties['var'], v => {
			step.properties['var'] = v;
			editorContext.notifyPropertiesChanged();
		});
	}
	if (step.properties['val']) {
		appendTextField(container, 'Value', isReadonly, step.properties['val'], v => {
			step.properties['val'] = parseInt(v, 10);
			editorContext.notifyPropertiesChanged();
		});
	}
	if (step.properties['text']) {
		appendTextField(container, 'Text', isReadonly, step.properties['text'], v => {
			step.properties['text'] = v;
			editorContext.notifyPropertiesChanged();
		});
	}
	return container;
}

const configuration = {
	undoStackSize: 5,

	toolbox: {
		groups: [
			{
				name: 'Tasks',
				steps: [
					Steps.createMathStep('add', 'Add', 'x', 10),
					Steps.createMathStep('sub', 'Subtract', 'x', 10),
					Steps.createMathStep('mul', 'Multiply', 'x', 10),
					Steps.createMathStep('div', 'Divide', 'x', 10),
					Steps.createTextStep('Message!')
				]
			},
			{
				name: 'Logic',
				steps: [Steps.createIfStep('x', 10, 'If'), Steps.createLoopStep('index', 3, 'Loop')]
			}
		]
	},

	steps: {
		iconUrlProvider: (componentType, type) => {
			const supportedIcons = ['if', 'loop', 'text'];
			const fileName = supportedIcons.includes(type) ? type : 'task';
			return `./assets/icon-${fileName}.svg`;
		}
	},

	validator: {
		step: step => {
			return Object.keys(step.properties).every(n => !!step.properties[n]);
		},
		root: definition => {
			return definition.properties['speed'] > 0;
		}
	},

	editors: {
		rootEditorProvider,
		stepEditorProvider
	},

	controlBar: true
};

const startDefinition = {
	properties: {
		speed: 300
	},
	sequence: [
		Steps.createTextStep('start!'),
		Steps.createLoopStep('index', 4, 'Loop', [
			Steps.createMathStep('add', 'x += 3', 'x', 3),
			Steps.createMathStep('mul', 'x *= 2', 'x', 2),
			Steps.createIfStep('x', 50, 'If x > 50', [Steps.createTextStep('yes!')], [Steps.createTextStep('no...')])
		]),
		Steps.createTextStep('the end')
	]
};

window.addEventListener('load', () => {
	const placeholder = document.getElementById('designer');
	designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
	document.getElementById('run').addEventListener('click', onRunClicked);
});
