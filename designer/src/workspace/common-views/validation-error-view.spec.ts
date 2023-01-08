import { Dom } from '../../core/dom';
import { ValidationErrorView } from './validation-error-view';

describe('ValidationErrorView', () => {
	it('shows and hides view', () => {
		const parent = Dom.svg('svg');
		const view = ValidationErrorView.create(parent, 10, 10);

		expect(parent.children.length).toEqual(0);

		view.setIsHidden(false);
		expect(parent.children.length).toEqual(1);
		const g = parent.children[0];

		view.setIsHidden(false);
		expect(parent.children.length).toEqual(1);
		expect(parent.children[0]).toEqual(g);

		view.setIsHidden(true);
		expect(parent.children.length).toEqual(0);
	});
});
