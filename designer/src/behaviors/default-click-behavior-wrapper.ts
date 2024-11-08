import { ClickBehaviorWrapper } from '../designer-extension';
import { Behavior } from './behavior';

export class DefaultClickBehaviorWrapper implements ClickBehaviorWrapper {
	public readonly wrap = (behavior: Behavior) => behavior;
}
