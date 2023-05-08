import { BadgeExtension } from '../../designer-extension';

export function findValidationBadgeIndex(extensions: BadgeExtension[]): number {
	return extensions.findIndex(ext => ext.id === 'validationError');
}
