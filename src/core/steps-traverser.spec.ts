import { ComponentType, ContainerStep, Step, TaskStep } from '../definition';
import { StepsTranverser } from './steps-traverser';

describe('StepsTranverser', () => {
	function createIf(name: string, falseStep: Step) {
		return {
			componentType: ComponentType.switch,
			id: 'if' + name,
			type: 'if' + name,
			name,
			branches: {
				true: [],
				false: [falseStep]
			},
			properties: {}
		};
	}

	function createTask(name: string): TaskStep {
		return {
			componentType: ComponentType.task,
			id: 'task' + name,
			type: 'task' + name,
			name,
			properties: {}
		};
	}

	const taskFoo: TaskStep = createTask('foo');
	const ifAlfa = createIf('beta', taskFoo);
	const ifBeta = createIf('alfa', ifAlfa);
	const loop = {
		componentType: ComponentType.container,
		id: 'loop',
		name: 'loop',
		type: 'loop',
		properties: {},
		sequence: [ifBeta]
	} as ContainerStep;
	const definition = {
		sequence: [
			createIf('q', createTask('p')),
			loop // loop > ifAlfa > 'false' > ifBeta > 'false' > taskFoo
		],
		properties: {}
	};

	it('returns task parents', () => {
		const parents = StepsTranverser.getParents(definition, taskFoo);
		expect(parents.length).toEqual(5);
		expect(parents[0]).toEqual(loop);
		expect(parents[1]).toEqual(ifBeta);
		expect(parents[2]).toEqual('false');
		expect(parents[3]).toEqual(ifAlfa);
		expect(parents[4]).toEqual('false');
	});

	it('returns alfa parents', () => {
		const parents = StepsTranverser.getParents(definition, ifBeta);
		expect(parents.length).toEqual(2);
		expect(parents[0]).toEqual(loop);
		expect(parents[1]).toEqual(ifBeta);
	});

	it('returns loop parents', () => {
		const parents = StepsTranverser.getParents(definition, loop);
		expect(parents.length).toEqual(0);
	});
});
