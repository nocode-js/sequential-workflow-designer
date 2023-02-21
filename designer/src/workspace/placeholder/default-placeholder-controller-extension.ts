import { PlaceholderController, PlaceholderControllerExtension } from '../../designer-extension';

export class DefaultPlaceholderControllerExtension implements PlaceholderControllerExtension {
	public create(): PlaceholderController {
		return {
			canCreate: () => true
		};
	}
}
