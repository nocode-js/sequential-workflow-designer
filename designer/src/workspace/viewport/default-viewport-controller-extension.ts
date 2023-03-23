import { ViewportControllerExtension } from '../../designer-extension';
import { DefaultViewportController } from './default-viewport-controller';

export class DefaultViewportControllerExtension implements ViewportControllerExtension {
	public readonly create = DefaultViewportController.create;
}
