import { createDesignerContextFake } from './designer-context-faker';

describe('createDesignerContextFake()', () => {

	it('returns an instance', () => {
		const context = createDesignerContextFake();
		expect(context).toBeDefined();
	});
});
