import { ViewPortControllerExtension } from '../../designer-extension';
import { DefaultViewPortController } from './default-view-port-controller';

export class DefaultViewPortControllerExtension implements ViewPortControllerExtension {
	public readonly create = DefaultViewPortController.create;
}
