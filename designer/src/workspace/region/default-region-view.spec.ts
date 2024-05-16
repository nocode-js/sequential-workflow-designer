import { Dom } from '../../core/dom';
import { DefaultRegionView } from './default-region-view';

describe('DefaultRegionView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		DefaultRegionView.create(parent, [70, 80, 90], 100);
		expect(parent.children.length).not.toEqual(0);
	});
});
