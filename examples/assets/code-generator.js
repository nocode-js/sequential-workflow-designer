/* global window, document, sequentialWorkflowDesigner, alert, confirm, console */

let designer;

const nextId = () => sequentialWorkflowDesigner.Uid.next();

function createTaskStep(type, name, properties) {
	return {
		id: nextId(),
		componentType: 'task',
		type,
		name,
		properties
	};
}

class Steps {
	static setNumber(name, targetVarName, value) {
		return createTaskStep('setNumber', name, {
			targetVarName,
			value
		});
	}

	static assignVar(name, targetVarName, sourceVarName) {
		return createTaskStep('assignVar', name, {
			targetVarName,
			sourceVarName
		});
	}

	static addVar(name, targetVarName, sourceVarName) {
		return createTaskStep('addVar', name, {
			targetVarName,
			sourceVarName
		});
	}

	static loop(name, varName, from, to, sequence) {
		return {
			id: nextId(),
			componentType: 'container',
			type: 'loop',
			name,
			properties: {
				varName,
				from,
				to
			},
			sequence: sequence || []
		};
	}
}

class CodeGenerator {
	static generateTask(step, variables) {
		const props = step.properties;
		switch (step.type) {
			case 'setNumber':
				variables.add(props.targetVarName);
				return `${props.targetVarName} = ${props.value};\r\n`;
			case 'assignVar':
				variables.add(props.targetVarName);
				variables.add(props.sourceVarName);
				return `${props.targetVarName} = ${props.sourceVarName};\r\n`;
			case 'addNumber':
				variables.add(props.targetVarName);
				return `${props.targetVarName} += ${props.const};\r\n`;
			case 'addVar':
				variables.add(props.targetVarName);
				variables.add(props.sourceVarName);
				return `${props.targetVarName} += ${props.sourceVarName};\r\n`;
			case 'loop':
				variables.add(props.varName);
				return (
					`for (${props.varName} = ${props.from}; ${props.varName} < ${props.to}; ${props.varName}++) {\r\n` +
					this.generateSequence(step.sequence, variables).replace(/(.*)\r\n/g, '  $1\r\n') +
					'}\r\n'
				);
		}
		throw new Error(`Not supported step: ${step.type}`);
	}

	static generateSequence(sequence, variables) {
		let code = '';
		for (let step of sequence) {
			code += this.generateTask(step, variables);
		}
		return code;
	}

	static generateHeader(variables) {
		if (variables.size === 0) {
			return '';
		}
		return 'let ' + Array.from(variables).join(', ') + ';\r\n\r\n';
	}

	static generateFooter(variables) {
		if (variables.size === 0) {
			return 'return null;';
		}
		return '\r\nreturn { ' + Array.from(variables).join(', ') + ' };';
	}
}

function canPlaceStep(step, parentSequence) {
	const parentSteps = designer.getStepParents(parentSequence);

	console.log(
		'parent steps',
		parentSteps.map(s => (typeof s === 'string' ? s : s.name))
	);

	if (step.type === 'loop' && parentSteps.length >= 2) {
		alert('Max depth is 2');
		return false;
	}
	return true;
}

class Editors {
	static createRootEditor() {
		const root = document.createElement('div');
		root.innerText = 'Please select any step.';
		return root;
	}

	static createStepEditor(step, editorContext) {
		const root = document.createElement('div');
		const title = document.createElement('h3');
		title.innerText = `Edit ${step.type} step`;
		root.appendChild(title);

		const nameItem = document.createElement('p');
		nameItem.innerHTML = '<label>Name</label> <input type="text" />';
		const nameInput = nameItem.querySelector('input');
		nameInput.value = step.name;
		nameInput.addEventListener('input', () => {
			step.name = nameInput.value;
			editorContext.notifyNameChanged();
		});
		root.appendChild(nameItem);

		const numberPropNames = ['value', 'from', 'to'];
		for (let propName of Object.keys(step.properties)) {
			const isNumberProp = numberPropNames.includes(propName);
			const item = document.createElement('p');
			item.innerHTML = `<label></label> <input type="${isNumberProp ? 'number' : 'text'}" />`;
			item.querySelector('label').innerText = propName;
			const input = item.querySelector('input');
			input.value = step.properties[propName];
			input.addEventListener('input', () => {
				const value = isNumberProp ? parseInt(input.value) : input.value;
				step.properties[propName] = value;
				editorContext.notifyPropertiesChanged();
			});
			root.appendChild(item);
		}
		return root;
	}
}

function reload(definition) {
	const variables = new Set();
	const code = CodeGenerator.generateSequence(definition.sequence, variables);
	const header = CodeGenerator.generateHeader(variables);
	const footer = CodeGenerator.generateFooter(variables);
	const finalCode = header + code + footer;

	const codeElement = document.getElementById('code');
	const resultElement = document.getElementById('result');

	codeElement.innerHTML = finalCode;
	try {
		const func = new Function(finalCode);
		const result = func();
		resultElement.innerText = JSON.stringify(result, null, 2);
	} catch (e) {
		resultElement.innerText = e;
	}
}

const configuration = {
	theme: 'soft',
	toolbox: {
		groups: [
			{
				name: 'Expressions',
				steps: [
					Steps.setNumber('set number', 'X', 0),
					Steps.assignVar('assign var', 'X', 'Y'),
					Steps.addVar('add var', 'X', 'Y'),
					Steps.loop('loop', 'j', 0, 5)
				]
			}
		]
	},

	steps: {
		iconUrlProvider: (_, type) => {
			const supportedIcons = ['loop'];
			const fileName = supportedIcons.includes(type) ? type : 'task';
			return `./assets/icon-${fileName}.svg`;
		},
		canInsertStep: (step, targetSequence) => {
			return canPlaceStep(step, targetSequence);
		},
		canMoveStep: (_, step, targetSequence) => {
			return canPlaceStep(step, targetSequence);
		},
		canDeleteStep: step => {
			return confirm(`Are you sure? (${step.name})`);
		}
	},

	validator: {
		step: step => {
			return Object.keys(step.properties).every(name => {
				const value = step.properties[name];
				return value === 0 || Boolean(value);
			});
		},
		root: () => {
			return true;
		}
	},

	editors: {
		rootEditorProvider: Editors.createRootEditor,
		stepEditorProvider: Editors.createStepEditor
	},
	controlBar: true
};

const startDefinition = {
	properties: {},
	sequence: [
		Steps.setNumber('a = 1', 'a', 1),
		Steps.setNumber('b = 1', 'b', 1),
		Steps.loop('loop', 'i', 2, 7, [
			Steps.setNumber('F = 0', 'fibonacci', 0),
			Steps.addVar('F += a', 'fibonacci', 'a'),
			Steps.addVar('F += b', 'fibonacci', 'b'),
			Steps.assignVar('a = b', 'a', 'b'),
			Steps.assignVar('b = F', 'b', 'fibonacci')
		])
	]
};

window.addEventListener('load', () => {
	const placeholder = document.getElementById('designer');
	designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
	designer.onDefinitionChanged.subscribe(reload);
	reload(startDefinition);
});
