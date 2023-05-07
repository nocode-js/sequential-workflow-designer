import { StepComponentViewWrapperExtension } from '../designer-extension';
import { StepComponentView } from './component';

export class DefaultStepComponentViewWrapperExtension implements StepComponentViewWrapperExtension {
	public readonly wrap = (view: StepComponentView): StepComponentView => view;
}
