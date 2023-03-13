import { BranchedStep, SequentialStep, Step } from '../definition';
import { ServicesResolver } from '../services';
import { createDesignerConfigurationStub } from '../test-tools/stubs';
import { StepExtensionResolver } from '../workspace/step-extension-resolver';
import { StepsTraverser } from './steps-traverser';

describe('StepsTraverser', () => {
	function createIf(name: string, falseStep: Step): BranchedStep {
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

	function createTask(name: string): Step {
		return {
			componentType: 'task',
			id: 'task' + name,
			type: 'task' + name,
			name,
			properties: {}
		};
	}

	const taskFoo: Step = createTask('foo');
	const ifAlfa = createIf('beta', taskFoo);
	const ifBeta = createIf('alfa', ifAlfa);
	const loop = {
		componentType: 'container',
		id: 'loop',
		name: 'loop',
		type: 'loop',
		properties: {},
		sequence: [ifBeta]
	} as SequentialStep;
	const definition = {
		sequence: [
			createIf('q', createTask('p')),
			loop // loop > ifAlfa > 'false' > ifBeta > 'false' > taskFoo
		],
		properties: {}
	};

	let traverser: StepsTraverser;

	beforeAll(() => {
		const configuration = createDesignerConfigurationStub();
		const services = ServicesResolver.resolve([], configuration);
		const resolver = StepExtensionResolver.create(services);
		traverser = new StepsTraverser(resolver);
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

		it('returns no parents for root sequence', () => {
			const parents = traverser.getParents(definition, definition.sequence);
			expect(parents.length).toEqual(0);
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
