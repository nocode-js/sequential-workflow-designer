import { Vector } from '../core/vector';
import { ViewPort } from '../designer-state';
import { createDesignerContextStub } from '../test-tools/stubs';
import { MoveViewPortBehavior } from './move-view-port-behavior';

describe('MoveViewPortBehavior', () => {
	it('when a user moves a mouse then the behavior updates the view port', () => {
		let lastViewPort: ViewPort = {
			position: new Vector(-1, -1),
			scale: -1
		};

		const context = createDesignerContextStub();
		context.state.onViewPortChanged.subscribe(vp => (lastViewPort = vp));
		context.state.setViewPort({
			position: new Vector(0, 0),
			scale: 1
		});

		const behavior = MoveViewPortBehavior.create(context.state, true);
		behavior.onStart();

		expect(lastViewPort.position.x).toEqual(0);
		expect(lastViewPort.position.y).toEqual(0);

		behavior.onMove(new Vector(10, 20));

		expect(lastViewPort.position.x).toEqual(-10);
		expect(lastViewPort.position.y).toEqual(-20);

		behavior.onMove(new Vector(5, 2));

		expect(lastViewPort.position.x).toEqual(-5);
		expect(lastViewPort.position.y).toEqual(-2);
	});
});
