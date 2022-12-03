import { Dom } from '../../core/dom';
import { RegionView } from './region-view';

describe('RegionView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		RegionView.create(parent, [70, 80, 90], 100);
		expect(parent.children.length).not.toEqual(0);
	});
});
