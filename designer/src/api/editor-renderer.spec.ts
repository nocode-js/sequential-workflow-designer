import { DesignerState } from '../designer-state';
import { EditorRenderer } from './editor-renderer';
import { Definition, DefinitionWalker, Step } from '../definition';
import { DefinitionChangeType } from '../designer-configuration';

const step: Step = {
	componentType: 'task',
	id: '0x1',
	name: 'Foo',
	properties: {},
	type: 'bar'
};

const definition: Definition = {
	properties: {},
	sequence: [step]
};

describe('EditorRenderer', () => {
	let walker: DefinitionWalker;
	let state: DesignerState;
	let callback: jasmine.Spy;

	beforeEach(() => {
		walker = new DefinitionWalker();
		state = new DesignerState(definition, false, false, false);
		callback = jasmine.createSpy('callback');
	});

	function createRenderer() {
		return EditorRenderer.create(state, walker, callback);
	}

	it('calls callbacks with null if any step is not selected at start', () => {
		createRenderer();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(null);
	});

	it('calls callbacks with step if step is selected at start', () => {
		state.setSelectedStepId(step.id);

		createRenderer();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(step);
	});

	it('calls callback 1 time after selectedStepId has changed many times to the same stepId', done => {
		let once = false;

		createRenderer();
		callback.calls.reset();

		state.onSelectedStepIdChanged.subscribe(() => {
			!once &&
				setTimeout(() => {
					expect(callback).toHaveBeenCalledTimes(1);
					expect(callback).toHaveBeenCalledWith(step);
					done();
				}, 100);
			once = true;
		});

		state.setSelectedStepId(step.id);
		state.setSelectedStepId(step.id);
		state.setSelectedStepId(step.id);
		state.setSelectedStepId(step.id);
	});

	it('calls callback after DefinitionChangeType.rootReplaced event, even stepId is the same', done => {
		state.setSelectedStepId(step.id);

		createRenderer();
		callback.calls.reset();
		expect(state.selectedStepId).toBe(step.id);

		state.notifyDefinitionChanged(DefinitionChangeType.rootReplaced, null);

		setTimeout(() => {
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(step);
			done();
		}, 100);
	});

	it('does not call callback after DefinitionChangeType.', done => {
		state.setSelectedStepId(step.id);

		createRenderer();
		callback.calls.reset();
		expect(state.selectedStepId).toBe(step.id);

		state.notifyDefinitionChanged(DefinitionChangeType.stepMoved, null);

		setTimeout(() => {
			expect(callback).not.toHaveBeenCalled();
			done();
		}, 100);
	});
});
