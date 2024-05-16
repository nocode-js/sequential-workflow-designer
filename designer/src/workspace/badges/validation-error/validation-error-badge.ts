import { ComponentContext } from '../../../component-context';
import { StepContext } from '../../../designer-extension';
import { Badge, StepComponentView } from '../../component';
import { ValidationErrorBadgeView } from './validation-error-badge-view';
import { ValidationErrorBadgeViewConfiguration } from './validation-error-badge-view-configuration';
import { ValidatorFactory } from './validator-factory';

export class ValidationErrorBadge implements Badge {
	public static createForStep(
		parentElement: SVGElement,
		view: StepComponentView,
		stepContext: StepContext,
		componentContext: ComponentContext,
		configuration: ValidationErrorBadgeViewConfiguration
	): ValidationErrorBadge {
		const validator = ValidatorFactory.createForStep(stepContext, view, componentContext);
		return new ValidationErrorBadge(parentElement, validator, configuration);
	}

	public static createForRoot(
		parentElement: SVGElement,
		componentContext: ComponentContext,
		configuration: ValidationErrorBadgeViewConfiguration
	) {
		const validator = ValidatorFactory.createForRoot(componentContext);
		return new ValidationErrorBadge(parentElement, validator, configuration);
	}

	public view: ValidationErrorBadgeView | null = null;

	private constructor(
		private readonly parentElement: SVGElement,
		private readonly validator: () => boolean,
		private readonly configuration: ValidationErrorBadgeViewConfiguration
	) {}

	public update(result: unknown): unknown {
		const isValid = this.validator();

		if (isValid) {
			if (this.view) {
				this.view.destroy();
				this.view = null;
			}
		} else if (!this.view) {
			this.view = ValidationErrorBadgeView.create(this.parentElement, this.configuration);
		}

		return isValid && result;
	}

	public resolveClick(): null {
		return null;
	}
}
