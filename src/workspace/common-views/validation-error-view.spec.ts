import { Dom } from '../../core/dom';
import { ValidationErrorView } from './validation-error-view';

describe('ValidationErrorView', () => {

	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		ValidationErrorView.create(parent, 10, 10);
		expect(parent.children.length).not.toEqual(0);
	});
});
