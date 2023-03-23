import { BadgeExtension } from '../../designer-extension';
import { ValidationErrorBadge } from './validation-error-badge';

export class ValidationErrorBadgeExtension implements BadgeExtension {
	public readonly createBadge = ValidationErrorBadge.create;

	public readonly createStartValue = () => true;
}
