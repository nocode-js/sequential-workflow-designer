import { Dom } from '../../core/dom';
import { measureTextWidth } from '../../core/measure-text-width';
import { LabelView } from './label-view';

describe('LabelView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		LabelView.create(
			parent,
			0,
			{
				height: 22,
				paddingX: 10,
				minWidth: 50,
				radius: 10
			},
			'test',
			'primary',
			measureTextWidth
		);
		expect(parent.children.length).not.toEqual(0);
	});
});
