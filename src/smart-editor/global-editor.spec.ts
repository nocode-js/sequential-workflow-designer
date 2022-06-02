import { GlobalEditor } from './global-editor';

describe('GlobalEditor', () => {

	it('create() creates editor', () => {
		const component = GlobalEditor.create({ properties: {}, sequence: [] }, () => document.createElement('div'));

		expect(component).toBeDefined();
	});
});
