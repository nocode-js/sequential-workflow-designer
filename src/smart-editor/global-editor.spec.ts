import { createDesignerContextStub } from '../test-tools/stubs';
import { GlobalEditor } from './global-editor';

describe('GlobalEditor', () => {
	it('create() creates editor', () => {
		const context = createDesignerContextStub();

		const component = GlobalEditor.create({ properties: {}, sequence: [] }, context);

		expect(component).toBeDefined();
	});
});
