import { Vector } from '../core';
import { Behavior } from './behavior';
import { BehaviorController } from './behavior-controller';
import { SelectStepBehaviorEndToken } from './select-step-behavior-end-token';

describe('BehaviorController', () => {
	it('passes the last end token to a next behavior', done => {
		const controller = BehaviorController.create(undefined);
		const baseBehavior = {
			onStart(position: Vector) {
				expect(position.x).toBe(1);
				expect(position.y).toBe(2);
			},
			onMove() {
				/* ... */
			}
		};

		function stage0() {
			const behavior0: Behavior = {
				...baseBehavior,
				onEnd() {
					setTimeout(stage1);
					return new SelectStepBehaviorEndToken('step-id', 12345);
				}
			};

			controller.start(new Vector(1, 2), behavior0);
			window.dispatchEvent(new MouseEvent('mouseup'));
		}

		function stage1() {
			const behavior1: Behavior = {
				...baseBehavior,
				onEnd(_0, _1, previousEndToken) {
					if (SelectStepBehaviorEndToken.is(previousEndToken)) {
						expect(previousEndToken.stepId).toBe('step-id');
						expect(previousEndToken.time).toBe(12345);
						done();
						return;
					}
					fail('Invalid end token');
				}
			};
			controller.start(new Vector(1, 2), behavior1);
			window.dispatchEvent(new MouseEvent('mouseup'));
		}

		stage0();
	});
});
