import { DraggedComponentExtension } from '../designer-extension';
import { DefaultDraggedComponent } from './default-dragged-component';

export class DefaultDraggedComponentExtension implements DraggedComponentExtension {
	public readonly create = DefaultDraggedComponent.create;
}
