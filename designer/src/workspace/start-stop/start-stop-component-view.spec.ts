import { Dom } from '../../core/dom';
import { StartStopComponentView } from './start-stop-component-view';

describe('StartStopComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		StartStopComponentView.create(parent, [], {});
		expect(parent.children.length).not.toEqual(0);
	});
});
