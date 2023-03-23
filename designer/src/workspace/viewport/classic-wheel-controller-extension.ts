import { WheelControllerExtension } from '../../designer-extension';
import { ClassicWheelController } from './classic-wheel-controller';

export class ClassicWheelControllerExtension implements WheelControllerExtension {
	public readonly create = ClassicWheelController.create;
}
