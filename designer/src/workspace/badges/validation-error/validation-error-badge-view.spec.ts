import { Dom } from '../../../core/dom';
import { ValidationErrorBadgeView } from './validation-error-badge-view';

describe('ValidationErrorBadgeView', () => {
	it('creates a badge', () => {
		const parent = Dom.svg('svg');
		ValidationErrorBadgeView.create(parent, {
			size: 20,
			iconSize: 10
		});

		expect(parent.children.length).toEqual(1);
	});
});
