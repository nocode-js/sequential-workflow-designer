import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { JoinView } from './join-view';

describe('JoinView', () => {
	let parent: SVGElement;

	beforeEach(() => {
		parent = Dom.svg('svg');
	});

	it('createJoins() creates view', () => {
		JoinView.createJoins(parent, new Vector(0, 0), [new Vector(10, 10)]);
		expect(parent.children.length).not.toEqual(0);
	});

	it('createStraightJoin() creates view', () => {
		JoinView.createStraightJoin(parent, new Vector(0, 0), 10);
		expect(parent.children.length).not.toEqual(0);
	});
});
