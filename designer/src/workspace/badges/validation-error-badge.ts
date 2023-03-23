import { ComponentContext } from '../../component-context';
import { StepValidator } from '../../designer-configuration';
import { StepContext } from '../../designer-extension';
import { Badge } from '../component';
import { ValidationErrorBadgeView } from './validation-error-badge-view';

export class ValidationErrorBadge implements Badge {
	public static create(parentElement: SVGElement, stepContext: StepContext, componentContext: ComponentContext): ValidationErrorBadge {
		return new ValidationErrorBadge(parentElement, stepContext, componentContext.configuration.validator);
	}

	public view: ValidationErrorBadgeView | null = null;

	private constructor(
		private readonly parentElement: SVGElement,
		private readonly stepContext: StepContext,
		private readonly validator: StepValidator | undefined
	) {}

	public update(result: unknown): unknown {
		const isValid = this.validator ? this.validator(this.stepContext.step, this.stepContext.parentSequence) : true;

		if (isValid) {
			if (this.view) {
				this.view.destroy();
				this.view = null;
			}
		} else if (!this.view) {
			this.view = ValidationErrorBadgeView.create(this.parentElement);
		}

		return isValid && result;
	}

	public resolveClick(): null {
		return null;
	}
}
