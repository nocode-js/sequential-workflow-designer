import { Vector } from '../core/vector';
import { Viewport } from '../designer-extension';
import { createDesignerContextStub } from '../test-tools/stubs';
import { MoveViewportBehavior } from './move-viewport-behavior';

describe('MoveViewportBehavior', () => {
	it('when a user moves a mouse then the behavior updates the viewport', () => {
		let lastViewport: Viewport = {
			position: new Vector(-1, -1),
			scale: -1
		};

		const context = createDesignerContextStub();
		context.state.onViewportChanged.subscribe(vp => (lastViewport = vp));
		context.state.setViewport({
			position: new Vector(0, 0),
			scale: 1
		});

		const behavior = MoveViewportBehavior.create(context.state, true);
		behavior.onStart();

		expect(lastViewport.position.x).toEqual(0);
		expect(lastViewport.position.y).toEqual(0);

		behavior.onMove(new Vector(10, 20));

		expect(lastViewport.position.x).toEqual(-10);
		expect(lastViewport.position.y).toEqual(-20);

		behavior.onMove(new Vector(5, 2));

		expect(lastViewport.position.x).toEqual(-5);
		expect(lastViewport.position.y).toEqual(-2);
	});
});
