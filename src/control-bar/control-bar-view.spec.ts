import { Dom } from '../core/dom';
import { ControlBarView } from './control-bar-view';

describe('ControlBarView', () => {
	it('creates view', () => {
		const parent = Dom.element('div');

		const component = ControlBarView.create(parent, true);

		expect(component).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
