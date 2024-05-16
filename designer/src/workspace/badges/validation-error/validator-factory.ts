import { ComponentContext } from '../../../component-context';
import { StepContext } from '../../../designer-extension';
import { StepComponentView } from '../../component';

export class ValidatorFactory {
	public static createForStep(stepContext: StepContext, view: StepComponentView, componentContext: ComponentContext): () => boolean {
		return () => {
			if (!componentContext.validator.validateStep(stepContext.step, stepContext.parentSequence)) {
				return false;
			}
			if (view.haveCollapsedChildren) {
				let allChildrenValid = true;
				componentContext.definitionWalker.forEachChildren(stepContext.step, (step, _, parentSequence) => {
					if (!componentContext.validator.validateStep(step, parentSequence)) {
						allChildrenValid = false;
						return false;
					}
				});
				if (!allChildrenValid) {
					return false;
				}
			}
			return true;
		};
	}

	public static createForRoot(componentContext: ComponentContext): () => boolean {
		return () => {
			return componentContext.validator.validateRoot();
		};
	}
}
