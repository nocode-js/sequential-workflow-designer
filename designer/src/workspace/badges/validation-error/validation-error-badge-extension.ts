import { Step } from '../../../definition';
import { ComponentContext } from '../../../component-context';
import { BadgeExtension, StepContext } from '../../../designer-extension';
import { Badge } from '../../component';
import { ValidationErrorBadge } from './validation-error-badge';
import { ValidationErrorBadgeExtensionConfiguration } from './validation-error-badge-extension-configuration';

const defaultConfiguration: ValidationErrorBadgeExtensionConfiguration = {
	view: {
		size: 22,
		iconSize: 12
	}
};

export class ValidationErrorBadgeExtension implements BadgeExtension {
	public static create(configuration?: ValidationErrorBadgeExtensionConfiguration): ValidationErrorBadgeExtension {
		return new ValidationErrorBadgeExtension(configuration ?? defaultConfiguration);
	}

	public readonly id = 'validationError';

	private constructor(private readonly configuration: ValidationErrorBadgeExtensionConfiguration) {}

	public createForStep(parentElement: SVGElement, stepContext: StepContext<Step>, componentContext: ComponentContext): Badge {
		return ValidationErrorBadge.createForStep(parentElement, stepContext, componentContext, this.configuration.view);
	}

	public createForRoot(parentElement: SVGElement, componentContext: ComponentContext): Badge {
		return ValidationErrorBadge.createForRoot(parentElement, componentContext, this.configuration.view);
	}

	public readonly createStartValue = () => true;
}
