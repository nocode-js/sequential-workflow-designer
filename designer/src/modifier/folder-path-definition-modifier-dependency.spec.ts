import { Definition, DefinitionWalker, Sequence, SequentialStep } from '../definition';
import { DesignerState } from '../designer-state';
import { FolderPathDefinitionModifierDependency } from './folder-path-definition-modifier-dependency';

function createFolderStep(id: string, sequence: Sequence): SequentialStep {
	return {
		componentType: 'folder',
		id,
		name: 'test',
		properties: {},
		type: 'folder',
		sequence
	};
}

describe('FolderPathDefinitionModifierDependency', () => {
	const walker = new DefinitionWalker();
	let definition: Definition;
	let state: DesignerState;
	let dependency: FolderPathDefinitionModifierDependency;

	beforeEach(() => {
		definition = {
			properties: {},
			sequence: [createFolderStep('0x1', [createFolderStep('0x2', [createFolderStep('0x3', [])])])]
		};
		state = new DesignerState(definition, false, true, true);
		state.setFolderPath(['0x1', '0x2', '0x3']);
		dependency = new FolderPathDefinitionModifierDependency(state, walker);
	});

	it('should clear path if step is removed', () => {
		definition.sequence.length = 0;

		dependency.update();

		expect(state.folderPath.length).toBe(0);
	});

	it('should reduce path if step is removed', () => {
		(definition.sequence[0] as SequentialStep).sequence.length = 0;

		dependency.update();

		expect(state.folderPath).toEqual(['0x1']);
	});

	it('keeps path if all folders are available', () => {
		dependency.update();

		expect(state.folderPath).toEqual(['0x1', '0x2', '0x3']);
	});
});
