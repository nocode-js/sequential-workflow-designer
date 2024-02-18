import { Definition, DefinitionWalker } from '../definition';
import { DesignerState } from '../designer-state';
import { SelectedStepIdDefinitionModifierDependency } from './selected-step-id-definition-modifier-dependency';

describe('SelectedStepIdDefinitionModifierDependency', () => {
	const walker = new DefinitionWalker();
	const definition: Definition = {
		properties: {},
		sequence: [
			{
				id: '0x1',
				componentType: 'task',
				type: 'test',
				name: 'test',
				properties: {}
			}
		]
	};
	const state = new DesignerState(definition, false, true, true);
	const dependency = new SelectedStepIdDefinitionModifierDependency(state, walker);

	it('should unselect step when it is deleted', () => {
		state.setSelectedStepId('0x2');

		dependency.update();

		expect(state.selectedStepId).toBeNull();
	});

	it('should not unselect step when it is not deleted', () => {
		state.setSelectedStepId('0x1');

		dependency.update();

		expect(state.selectedStepId).toBe('0x1');
	});
});
