import { ContainerStep, Step, SwitchStep, TaskStep } from '../definition';
import { StepExtensionsResolver } from '../workspace/step-extensions-resolver';
import { StepsTraverser } from './steps-traverser';

describe('StepsTraverser', () => {
	function createIf(name: string, falseStep: Step): SwitchStep {
		return {
			componentType: 'switch',
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
			componentType: 'task',
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
		componentType: 'container',
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

	let traverser: StepsTraverser;

	beforeAll(() => {
		const extensions = StepExtensionsResolver.resolve([]);
		traverser = new StepsTraverser(extensions);
	});

	describe('getParents', () => {
		it('returns task parents', () => {
			const parents = traverser.getParents(definition, taskFoo);
			expect(parents.length).toEqual(6);
			expect(parents[0]).toEqual(loop);
			expect(parents[1]).toEqual(ifBeta);
			expect(parents[2]).toEqual('false');
			expect(parents[3]).toEqual(ifAlfa);
			expect(parents[4]).toEqual('false');
			expect(parents[5]).toEqual(taskFoo);
		});

		it('returns alfa parents', () => {
			const parents = traverser.getParents(definition, ifBeta);
			expect(parents.length).toEqual(2);
			expect(parents[0]).toEqual(loop);
			expect(parents[1]).toEqual(ifBeta);
		});

		it('returns loop parents', () => {
			const parents = traverser.getParents(definition, loop);
			expect(parents.length).toEqual(1);
			expect(parents[0]).toEqual(loop);
		});
	});

	describe('findById', () => {
		it('returns null when stepId not exists', () => {
			const found = traverser.findById(definition, 'undefined');
			expect(found).toBeNull();
		});

		it('returns task step', () => {
			const found = traverser.findById(definition, taskFoo.id);
			expect(found).toEqual(taskFoo);
		});

		it('returns container step', () => {
			const found = traverser.findById(definition, loop.id);
			expect(found).toEqual(loop);
		});

		it('returns switch step', () => {
			const found = traverser.findById(definition, ifBeta.id);
			expect(found).toEqual(ifBeta);
		});
	});
});
