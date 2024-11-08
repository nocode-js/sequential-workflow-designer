import { ClickBehaviorWrapper, ClickBehaviorWrapperExtension } from '../designer-extension';
import { DefaultClickBehaviorWrapper } from './default-click-behavior-wrapper';

export class DefaultClickBehaviorWrapperExtension implements ClickBehaviorWrapperExtension {
	public create(): ClickBehaviorWrapper {
		return new DefaultClickBehaviorWrapper();
	}
}
